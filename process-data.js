const fs = require("fs");
const path = require("path");

if (process.argv.length >= 4) {
  const data = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), process.argv[2]), "utf8"));

  let processed = data.filter(bus => {
    return (bus.locations && bus.locations.length === 1) && (bus.locations[0].length === 2 || bus.locations[0] === "AUD");
  }).map(bus => {
    return {
      location: bus.locations[0],
      bus_id: bus.bus_id,
      time: bus.time ? new Date(bus.time.$date) : new Date(parseInt(bus._id.$oid.substring(0, 8), 16) * 1000)
    };
  });

  const string = JSON.stringify(processed);
  fs.writeFileSync(path.resolve(process.cwd(), process.argv[3]), string, "utf8");

  if (process.argv.length >= 5) {
    const audit = fs.readFileSync(path.resolve(process.cwd(), process.argv[4]), "utf8");
    if (string === audit.split("\n")[0]) {
      console.log("Successful audit.");
    } else {
      console.log("Audit failed.");
    }
  }
} else {
  console.log("USAGE:");
  console.log("whatevercommandyouusedtorunthismontrosity <unprocessed> <processed>");
}
