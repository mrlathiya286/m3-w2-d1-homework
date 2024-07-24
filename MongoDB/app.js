const { MongoClient } = require("mongodb");

async function run() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("statsdb");
    const collection = db.collection("uscensus");

    // Task 3: Insert initial data
    const initialData = [
      {
        city: "San Juan",
        zip: "00926",
        state: "PR",
        income: "34781",
        age: "44",
      },
      { city: "Corona", zip: "11368", state: "NY", income: "50797", age: "32" },
      {
        city: "Chicago",
        zip: "60629",
        state: "IL",
        income: "42019",
        age: "31",
      },
      {
        city: "El Paso",
        zip: "79936",
        state: "TX",
        income: "54692",
        age: "31",
      },
      {
        city: "Los Angeles",
        zip: "90011",
        state: "CA",
        income: "36954",
        age: "28",
      },
      {
        city: "Norwalk",
        zip: "90650",
        state: "CA",
        income: "66453",
        age: "35",
      },
    ];
    await collection.insertMany(initialData);
    console.log("Initial data inserted.");

    // Task 4: Insert additional records
    const additionalData = [
      {
        city: "Pacoima",
        zip: "91331",
        state: "CA",
        income: "60360",
        age: "33",
      },
      {
        city: "Ketchikan",
        zip: "99950",
        state: "AK",
        income: "00000",
        age: "00",
      },
    ];
    await collection.insertMany(additionalData);
    console.log("Additional data inserted.");

    // Task 5: Find the zip code for Corona, NY
    const zipCoronaNY = await collection.findOne(
      { city: "Corona", state: "NY" },
      { projection: { zip: 1, _id: 0 } }
    );
    console.log(`The zip code for Corona, NY is: ${zipCoronaNY.zip}`);

    // Task 6: Find the income for all cities in California
    const incomesCA = await collection
      .find({ state: "CA" }, { projection: { city: 1, income: 1, _id: 0 } })
      .toArray();
    console.log("Incomes for cities in California:");
    incomesCA.forEach((doc) =>
      console.log(`City: ${doc.city}, Income: ${doc.income}`)
    );

    // Task 7: Update the income and age for Alaska
    await collection.updateOne(
      { state: "AK" },
      { $set: { income: "38910", age: "46" } }
    );
    console.log("Updated income and age for Alaska.");

    // Task 8: Sort records in ascending order by state
    const sortedRecords = await collection.find().sort({ state: 1 }).toArray();
    console.log("Records sorted by state:");
    sortedRecords.forEach((doc) => console.log(doc));
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
//
