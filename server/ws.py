import asyncio
import websockets

import sqlite3
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
    request = await websocket.recv()

    def get_station_code(station):
        query = f"SELECT code from stations WHERE name = '{station.split(' (')[0]}'"
        if (len(station.split(' (')) == 2):
            query += f" AND state = '{station.split('(')[1].split(')')[0]}'"
        c.execute(query)
        return c.fetchall()[0][0]

    async def send_progress(i, numDates, info, time=None):
        progress = dict()

        progress["percentComplete"] = round(
            round((i if len(info.split()) == 6 else i + 1) / numDates, 2) * 100)
        if time:
            progress["time"] = time
        progress["info"] = info
        progress["date"] = f'Fetching date {i + 1} of {numDates}'

        await websocket.send(json.dumps({"progress": progress}))
        await asyncio.sleep(0.1)

    with open("./status.pk", "wb") as pk:
        pickle.dump(False, pk)

    args = json.loads(request)
    dept_station, arrival_station = args["deptStation"], args["arrivalStation"]
    dates = args["dates"]

    conn = sqlite3.connect(
        "./stations.db")
    c = conn.cursor()
    dept_code, arrival_code = get_station_code(
        dept_station), get_station_code(arrival_station)
    conn.close()

    coach, business, first = args["coach"], args["business"], args["first"]
    roomette, bedroom, family_bedroom = args["roomette"], args["bedroom"], args["familyBedroom"]

    def delay():
        time.sleep(random.randint(10, 20) / 100)

    def get_proxy():
        with open("./proxy.pk", "rb") as pk:
            proxy = pickle.load(pk)
        old_proxy = proxy
        proxy_port = int(proxy[-5:])
        if (proxy_port == 40249):
            proxy_port = 40200
        else:
            proxy_port += 1
        with open("./proxy.pk", "wb") as pk:
            pickle.dump(proxy[:-5] + str(proxy_port), pk)
        return old_proxy

    noTrains = False
    fares = list()

    '''
    try:
    '''
    i = 0
    while (i < len(dates)):
        date = dates[i]
        if (i % 3 == 0):
            await send_progress(i, len(
                dates), f"Connecting to proxy {math.ceil((i + 1) / 3)} of {math.ceil(len(dates) / 3)}", 22)

            if (i != 0):
                driver.quit()

                # comment out the line below when developing on Windows
                display.stop()
            time.sleep(2)

            # comment out the two lines below when developing on Windows
            display = Display(visible=1, size=(1280, 1440))
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
            options.add_argument('ignore-certificate-errors')
            options.add_argument(
                '--disable-blink-features=AutomationControlled')
            options.add_experimental_option(
                'useAutomationExtension', False)
            options.add_experimental_option(
                "excludeSwitches", ["enable-automation"])

            driver = webdriver.Chrome(
                options=options, seleniumwire_options=seleniumwire_options, service=service)
            driver.set_page_load_timeout(18)
            try:
                driver.get("http://www.amtrak.com/")
            except Exception:
                pass
            driver.maximize_window()
            driver.set_page_load_timeout(15)

        await send_progress(i, len(dates), "Inputting travel information")
        await asyncio.sleep(0.1)

        if not (i % 3 == 0 or noTrains):
            new_search_button = driver.find_element(
                By.XPATH, "//button[contains(.,'New Search')]")
            ActionChains(driver).move_to_element(
                new_search_button).perform()
            delay()
            new_search_button.click()
            delay()

        if (i % 3 == 0):
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

        dept_date_input = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((
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

        await send_progress(i, len(dates), "Waiting on amtrak.com", 17)
        await asyncio.sleep(0.1)

        WebDriverWait(driver, 25).until(
            EC.any_of(EC.element_to_be_clickable((By.XPATH, "//button[contains(.,'New Search')]")),
                      EC.element_to_be_clickable(
                (By.XPATH, "//button[contains(.,'Cancel')]")),
                EC.presence_of_element_located((By.XPATH, "//div[@class='col-12 d-inline-flex']"))))
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

            fare["date"] = date

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
            if (rooms_button and route != "Mixed Service"):
                rooms_button = rooms_button[0]
                if (roomette or bedroom or family_bedroom):
                    await send_progress(
                        i, len(dates), "Browsing available rooms")
                    await asyncio.sleep(0.1)

                    rooms_price = rooms_button.find_element(
                        By.XPATH, ".//span[@class='amount ng-star-inserted']").text
                    ActionChains(driver).move_to_element(
                        rooms_button).perform()
                    delay()
                    rooms_button.click()
                    delay()

                    bedroom_button = None
                    try:
                        bedroom_button = WebDriverWait(driver, 3).until(EC.element_to_be_clickable((
                            By.XPATH, "//button[@aria-label='Bedroom']")))
                    except Exception:
                        pass
                    family_bedroom_button = driver.find_elements(
                        By.XPATH, "//button[@aria-label='Family Bedroom']")
                    if (family_bedroom_button):
                        family_bedroom_button = family_bedroom_button[0]
                    if (not (bedroom_button or family_bedroom_button)):
                        search_results = driver.find_element(
                            By.XPATH, "//div[@class='search-results-leg-travel-class-content']")
                        room_type = WebDriverWait(search_results, 5).until(
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
                        if (room_type == "Bedroom" and bedroom):
                            fare["bedroom"] = rooms_price
                        elif (room_type == "Family Bedroom" and family_bedroom):
                            fare["familyBedroom"] = rooms_price
                    if (roomette and not ("bedroom" in fare or "familyBedroom" in fare)):
                        fare["roomette"] = rooms_price
                    if (bedroom and bedroom_button):
                        bedroom_button.click()
                        WebDriverWait(driver, 5).until(EC.element_to_be_clickable(
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
                        WebDriverWait(driver, 5).until(EC.element_to_be_clickable(
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
                    rooms_button.click()
                    html = driver.find_element(By.TAG_NAME, "html")
                    html.send_keys(Keys.HOME)
                    time.sleep(1)

            capacity = details.find_element(
                By.XPATH, ".//div[@class='seat-capacity-text']").text
            if (capacity):
                fare["capacity"] = capacity.split(
                )[0][capacity.index("%") - 2:capacity.index("%") + 1]

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

            if (any(fare_type in ["coach", "business", "first", "roomette", "bedroom", "familyBedroom"] for fare_type in fare)):
                fares.append(fare)

        if (i == len(dates) - 1):
            await send_progress(i, len(dates), "Finishing up")
            await asyncio.sleep(0.1)

            driver.close()
            # comment out the line below when developing on Windows
            display.stop()
            break
        else:
            i += 1
    '''
    except Exception:
        # comment out the line below when developing on Windows
        display.stop()
        pass
    '''

    with open("./status.pk", "wb") as pk:
        pickle.dump(True, pk)

    try:
        if (len(fares) == 0):
            await send_progress(i, len(dates), "No trains found!")
            await asyncio.sleep(0.1)
        await websocket.send(json.dumps({"fares": fares}))
        await asyncio.sleep(0.1)
    except Exception:
        pass


async def main():
    async with websockets.serve(handler, "", 5001):
        await asyncio.Future()

asyncio.run(main())
