import asyncio
import websockets

import json

from pyvirtualdisplay import Display
from seleniumwire import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys

import pickle
import time
import random
import math


async def handler(websocket):
    async def send_progress(date_index, percent_index, numDates, info, time=None):
        progress = dict()

        progress["percentComplete"] = round(
            round(percent_index / (numDates + math.ceil(numDates / 3)), 2) * 100)
        if time:
            progress["time"] = time
        progress["info"] = info
        progress["date"] = f'Fetching date {date_index + 1} of {numDates}'

        await websocket.send(json.dumps({"progress": progress}))
        await asyncio.sleep(0.1)

    def delay():
        time.sleep(random.randint(10, 20) / 100)

    def get_proxy():
        with open("./proxy.pk", "rb") as pk:
            proxy = pickle.load(pk)
        old_proxy_port = int(proxy[-5:])
        proxy_port = old_proxy_port
        while (proxy_port == old_proxy_port):
            proxy_port = random.randint(10001, 10100)
        with open("./proxy.pk", "wb") as pk:
            pickle.dump(proxy[:-5] + str(proxy_port), pk)
        return proxy

    try:
        request = await websocket.recv()

        with open("./status.pk", "wb") as pk:
            pickle.dump(False, pk)

        args = json.loads(request)
        dept_station, arrival_station = args["deptStation"], args["arrivalStation"]
        dept_code, arrival_code = args["deptCode"], args["arrivalCode"]
        request_time = args["requestTime"]
        dates = args["dates"]
        coach, business, first = args["coach"], args["business"], args["first"]
        cheapest_room, roomette, bedroom, family_bedroom = args[
            "cheapestRoom"], args["roomette"], args["bedroom"], args["familyBedroom"]
        share = args["share"]

        noTrains = False
        fares = list()
        addInfo = dict()
        fares.append(addInfo)

        date_index, percent_index = 0, 0
        while (date_index < len(dates)):
            date = dates[date_index]
            if (date_index % 3 == 0):
                await send_progress(date_index, percent_index, len(
                    dates), f"Connecting to proxy {math.ceil((date_index + 1) / 3)} of {math.ceil(len(dates) / 3)}", 19)

                if (date_index != 0):
                    driver.quit()

                    # comment out the line below when developing on Windows
                    display.stop()

                # comment out the two lines below when developing on Windows
                display = Display(visible=1, size=(
                    random.randint(1300, 1400), random.randint(700, 800)))
                display.start()

                seleniumwire_options = {
                    "proxy": {
                        "http": get_proxy()
                    }
                }

                service = Service(r"chromedriver")
                options = webdriver.ChromeOptions()
                options.add_argument("--no-sandbox")
                options.add_argument("--remote-debugging-port=9225")
                options.add_argument("ignore-certificate-errors")
                options.add_argument(
                    "--disable-blink-features=AutomationControlled")
                options.add_experimental_option(
                    "useAutomationExtension", False)
                options.add_experimental_option(
                    "excludeSwitches", ["enable-automation"])

                driver = webdriver.Chrome(
                    options=options, seleniumwire_options=seleniumwire_options, service=service)
                driver.maximize_window()
                driver.set_page_load_timeout(30)
                try:
                    driver.get("https://www.amtrak.com/")
                except Exception:
                    pass

                percent_index += 1

            await send_progress(date_index, percent_index, len(dates), "Entering travel information")
            await asyncio.sleep(0.1)

            if (date_index % 3 != 0 and not noTrains):
                new_search_button = driver.find_element(
                    By.XPATH, "//button[contains(.,'New Search')]")
                ActionChains(driver).move_to_element(
                    new_search_button).perform()
                delay()
                new_search_button.click()
                delay()

            if (date_index % 3 == 0):
                dept_station_input = driver.find_element(
                    By.XPATH, "//input[@data-placeholder='From']")
                ActionChains(driver).move_to_element(
                    dept_station_input).perform()
                delay()
                dept_station_input.click()
                delay()
                dept_station_input.send_keys(dept_code)
                delay()

                arrival_station_input = driver.find_element(
                    By.XPATH, "//input[@data-placeholder='To']")
                ActionChains(driver).move_to_element(
                    arrival_station_input).perform()
                delay()
                arrival_station_input.click()
                delay()
                arrival_station_input.send_keys(arrival_code)
                delay()

            dept_date_input = WebDriverWait(driver, 3).until(EC.element_to_be_clickable((
                By.XPATH, "//input[@data-julie='departdisplay_booking_oneway']")))
            ActionChains(driver).move_to_element(dept_date_input).perform()
            delay()
            dept_date_input.click()
            delay()
            dept_date_input.clear()
            delay()
            dept_date_input.send_keys(date)
            delay()

            done_button = driver.find_element(
                By.XPATH, "//button[contains(.,'Done')]")
            ActionChains(driver).move_to_element(done_button).perform()
            delay()
            done_button.click()
            delay()

            noTrains = False

            find_trains_button = driver.find_element(
                By.XPATH, "(//button[@data-julie='findtrains'])[1]")
            ActionChains(driver).move_to_element(
                find_trains_button).perform()
            delay()
            find_trains_button.click()

            await send_progress(date_index, percent_index, len(dates), "Waiting on amtrak.com", 10)
            await asyncio.sleep(0.1)

            try:
                WebDriverWait(driver, 10).until(
                    EC.any_of(EC.element_to_be_clickable((By.XPATH, "//button[contains(.,'New Search')]")),
                              EC.element_to_be_clickable(
                        (By.XPATH, "//button[contains(.,'Cancel')]")),
                        EC.presence_of_element_located((By.XPATH, "//div[@class='col-12 d-inline-flex']"))))
            except Exception:
                pass
            if driver.find_elements(By.XPATH, "//button[contains(.,'Cancel')]") or \
                    driver.find_elements(By.XPATH, "//div[@class='col-12 d-inline-flex']"):
                if driver.find_elements(By.XPATH, "//button[contains(.,'Cancel')]"):
                    cancel_button = driver.find_element(
                        By.XPATH, "//button[contains(.,'Cancel')]")
                    ActionChains(driver).move_to_element(
                        cancel_button).perform()
                    delay()
                    cancel_button.click()
                    delay()
                noTrains = True

            if (not noTrains):
                fare = dict()

                details = driver.find_element(
                    By.XPATH, "(//div[contains(@class,'details d-flex flex-grow-1')])[1]")

                fare["date"] = date

                route = details.find_elements(
                    By.XPATH, "(.//span[@class='mix-name'])[1]"
                )
                if (route):
                    route = route[0].text
                else:
                    route = details.find_elements(
                        By.XPATH, ".//a[@class='handpointer']")
                    if (route):
                        route = route[0].text
                    else:
                        route = "Multiple Trains"
                fare["route"] = route

                service = driver.find_element(
                    By.XPATH, "(//div[contains(@class,'service d-flex flex-grow-1')])[1]")

                if (coach):
                    coach_button = service.find_elements(
                        By.XPATH, ".//button[contains(.,'Coach')]")
                    if (coach_button):
                        fare["coach"] = coach_button[0].find_element(
                            By.XPATH, ".//span[@class='amount ng-star-inserted']").text

                if (business):
                    business_button = service.find_elements(
                        By.XPATH, ".//button[contains(.,'Business')]")
                    if (business_button):
                        fare["business"] = business_button[0].find_element(
                            By.XPATH, ".//span[@class='amount ng-star-inserted']").text

                if (first):
                    first_button = service.find_elements(
                        By.XPATH, ".//button[contains(.,'First')]")
                    if (first_button):
                        fare["first"] = first_button[0].find_element(
                            By.XPATH, ".//span[@class='amount ng-star-inserted']").text

                rooms_button = service.find_elements(
                    By.XPATH, ".//button[contains(.,'Rooms')]")
                bedroom_button, family_bedroom_button = None, None
                if (rooms_button):
                    rooms_button = rooms_button[0]
                    rooms_price = rooms_button.find_element(
                        By.XPATH, ".//span[@class='amount ng-star-inserted']").text
                    if (cheapest_room):
                        fare["rooms"] = rooms_price
                    elif ((roomette or bedroom or family_bedroom) and route != "Mixed Service" and route != "Multiple Trains"):
                        await send_progress(date_index, percent_index, len(dates), "Browsing available rooms")
                        await asyncio.sleep(0.1)
                        ActionChains(driver).move_to_element(
                            rooms_button).perform()
                        delay()
                        rooms_button.click()
                        delay()

                        if (bedroom):
                            try:
                                bedroom_button = WebDriverWait(driver, 3).until(EC.element_to_be_clickable((
                                    By.XPATH, "//button[@aria-label='Bedroom']")))
                            except Exception:
                                pass
                        if (family_bedroom):
                            try:
                                family_bedroom_button = WebDriverWait(driver, 3).until(EC.element_to_be_clickable((
                                    By.XPATH, "//button[@aria-label='Family Bedroom']")))
                            except Exception:
                                pass
                        if (not (bedroom_button or family_bedroom_button)):
                            search_results = driver.find_element(
                                By.XPATH, "//div[@class='search-results-leg-travel-class-content']")
                            try:
                                room_type = WebDriverWait(search_results, 3).until(
                                    EC.any_of(EC.presence_of_element_located((By.XPATH, "(.//span[@class='font-light ng-tns-c154-10'])[2]")),
                                              EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-11'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-12'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-13'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-14'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-15'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-16'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-17'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-18'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-19'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-20'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-21'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-22'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-23'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-24'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-25'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-26'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-27'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-28'])[2]")),
                                        EC.presence_of_element_located(
                                        (By.XPATH, "(.//span[@class='font-light ng-tns-c154-29'])[2]")),
                                        EC.presence_of_element_located((By.XPATH, "(.//span[@class='font-light ng-tns-c154-30'])[2]"))))
                                room_type = room_type.text
                                if (room_type == "Roomette" and roomette):
                                    fare["roomette"] = rooms_price
                                elif (room_type == "Bedroom" and bedroom):
                                    fare["bedroom"] = rooms_price
                                elif (room_type == "Family Bedroom" and family_bedroom):
                                    fare["familyBedroom"] = rooms_price
                            except Exception:
                                pass
                        if (roomette and (bedroom_button or family_bedroom_button)):
                            fare["roomette"] = rooms_price
                        if (bedroom and bedroom_button):
                            bedroom_button.click()
                            WebDriverWait(driver, 3).until(EC.element_to_be_clickable(
                                (By.XPATH, "//button[contains(.,'Add to Cart')]")))
                            accomodation_pill = driver.find_elements(
                                By.XPATH, "//accomodation-pill")[1]
                            bedroom_price = accomodation_pill.find_elements(
                                By.XPATH, ".//span[@class='price-currency']")
                            if (bedroom_price):
                                bedroom_price = bedroom_price[0].text
                            else:
                                bedroom_price = rooms_price
                            fare["bedroom"] = bedroom_price
                        if (family_bedroom and family_bedroom_button):
                            ActionChains(driver).move_to_element(
                                family_bedroom_button).perform()
                            delay()
                            family_bedroom_button.click()
                            WebDriverWait(driver, 3).until(EC.element_to_be_clickable(
                                (By.XPATH, "//button[contains(.,'Add to Cart')]")))
                            accomodation_pill = driver.find_elements(
                                By.XPATH, "//accomodation-pill")[1]
                            family_bedroom_price = accomodation_pill.find_elements(
                                By.XPATH, ".//span[@class='price-currency']")
                            if (family_bedroom_price):
                                family_bedroom_price = family_bedroom_price[0].text
                            else:
                                family_bedroom_price = rooms_price
                            fare["familyBedroom"] = family_bedroom_price
                        html = driver.find_element(By.TAG_NAME, "html")
                        html.send_keys(Keys.HOME)
                        time.sleep(0.5)
                        rooms_button.click()
                        html.send_keys(Keys.HOME)
                        time.sleep(0.5)

                capacity = details.find_element(
                    By.XPATH, ".//div[@class='seat-capacity-text']").text
                if (capacity):
                    fare["capacity"] = capacity.split()[0]

                depart_time = details.find_element(
                    By.XPATH, "(.//span[@class='font-light'])[1]").text
                depart_period = details.find_element(
                    By.XPATH, "(.//span[@class='time-period'])[1]").text
                fare["departs"] = depart_time + depart_period

                fare["duration"] = driver.find_element(
                    By.XPATH, "(//span[@amt-auto-test-id='journey-duration'])[1]").text

                arrival_time = details.find_element(
                    By.XPATH, "(.//span[@class='font-light'])[2]").text
                arrival_period = details.find_element(
                    By.XPATH, "(.//span[@class='time-period'])[2]").text
                fare["arrives"] = arrival_time + arrival_period

                if (any(fare_type in ["coach", "business", "first", "rooms", "roomette", "bedroom", "familyBedroom"] for fare_type in fare)):
                    fares.append(fare)

            if (date_index == len(dates) - 1):
                percent_index += 1

                await send_progress(date_index, percent_index, len(dates), "Finishing up")
                await asyncio.sleep(0.1)

                driver.quit()
                # comment out the line below when developing on Windows
                display.stop()
                break
            else:
                date_index += 1
                percent_index += 1
    except Exception:
        try:
            driver.quit()
        except Exception:
            pass

        # comment out the try-except block below when developing on Windows
        try:
            display.stop()
        except Exception:
            pass

    try:
        with open("./status.pk", "wb") as pk:
            pickle.dump(True, pk)

        if (len(fares) == 1):
            await send_progress(date_index, percent_index, len(dates), "No trains found!")
            await asyncio.sleep(0.1)
        else:
            await websocket.send(json.dumps({"fares": fares}))

        if (len(fares) > 1 and share):
            with open("./recent_searches.pk", "rb") as pk:
                recent_searches = list()
                fares[0]["deptStation"] = dept_station
                fares[0]["arrivalStation"] = arrival_station
                fares[0]["requestTime"] = request_time
                try:
                    recent_searches = pickle.load(pk)
                    recent_searches.insert(0, fares)
                except Exception:
                    pass
            with open("./recent_searches.pk", "wb") as pk:
                pickle.dump(
                    recent_searches if recent_searches else [fares], pk)
    except Exception:
        pass


async def main():
    async with websockets.serve(handler, "", 5001):
        await asyncio.Future()

asyncio.run(main())
