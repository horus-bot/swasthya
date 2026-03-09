# test_emergency_pkl.py
import pandas as pd

def test_pickle(file_path):
    try:
        # Load pickle file
        df = pd.read_pickle(file_path)
        print("Pickle file loaded successfully!")
        print(f"Shape of DataFrame: {df.shape}\n")
        
        # Preview first 10 rows
        print("First 10 rows:")
        print(df.head(10))
        
        # Column names and types
        print("\nColumn Data Types:")
        print(df.dtypes)
        
    except FileNotFoundError:
        print(f"Pickle file not found at: {file_path}")
    except Exception as e:
        print(f"Error loading pickle file: {e}")

if __name__ == "__main__":
    # Update this path to where your emergency forecast pickle is saved
    pickle_path = "outputs/ward_emergency_forecast.pkl"
    test_pickle(pickle_path)
