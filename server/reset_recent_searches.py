import pickle

with open("./recent_searches.pk", "wb") as pk:
    pickle.dump([], pk)
