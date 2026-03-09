import pandas as pd

"""Small diagnostic to inspect training ranges used by the model."""

df = pd.read_csv("synthetic_chennai_dengue_dataset.csv")

cols = [
    "rainfall_mm",
    "temperature_c",
    "humidity_percent",
    "mosquito_index",
    "prev_month_cases",
    "cases"
]

print(df[cols].describe())

print("\nMax cases in training set:", df["cases"].max())
