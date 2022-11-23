import pickle

with open("./status.pk", "wb") as pk:
    pickle.dump(True, pk)
