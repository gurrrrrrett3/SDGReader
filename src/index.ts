import fs from "fs";
import path from "path";

if (!fs.existsSync(path.resolve("./input"))) {
  fs.mkdirSync(path.resolve("./input"));
}

if (!fs.existsSync(path.resolve("./output"))) {
  fs.mkdirSync(path.resolve("./output"));
}

let data: Record<string, number[]> = {};

const files = fs.readdirSync(path.resolve("./input"));

files.forEach((file) => {
  const content = fs.readFileSync(path.resolve("./input", file), "utf-8");
  const lines = content.split("\n");

  lines.forEach((line) => {
    const items = line.split(",");

    items.forEach((item) => {
      const [key, value] = item.split("=");

      if (!data[key]) {
        data[key] = [];
      }

      data[key].push(parseFloat(value));
    });
  });
});

let cleanData: Record<
  string,
  {
    min: number;
    max: number;
    avg: number;
    count: number;
  }
> = {};

Object.keys(data).forEach((key) => {
  const values = data[key];

  console.log(key);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  cleanData[key] = {
    min,
    max,
    avg,
    count: values.length,
  };
});

let sortedData = Object.entries(cleanData)
  .sort((a, b) => {
    return b[1].avg - a[1].avg;
  })
  .filter(([key]) => {
    if (key.includes("count") || key.includes("ConfigLoaded") || key.includes("ResetGame")) {
      return false;
    }

    if (key.endsWith("total") || key.endsWith("avg")) {
      return false;
    }

    const ignoreKeys = ["tps", "itemCount", "time", "playerCount", "vehicleCount"];

    if (ignoreKeys.includes(key)) {
      return false;
    }

    return true;
  });

let output =
  "event,min,max,avg\n" +
  sortedData
    .map(([key, value]) => {
      return `${key.replace(".time", "")},${value.min},${value.max},${value.avg}`;
    })
    .join("\n");

fs.writeFileSync(path.resolve("./output", "output.csv"), output);
