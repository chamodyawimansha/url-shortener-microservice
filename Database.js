import mongoose from "mongoose";

export class Database {
  constructor(db_url) {
    mongoose.connect(db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.db = mongoose.connection;

    this.urlSchema = new mongoose.Schema({
      uniqueIdentifier: String,
      url: String,
    });

    db.on("error", () => {
      return { Error: "Database Error" };
    });
  }

  insert(url) {
    const Url = mongoose.model("Url", this.urlSchema);

    const newUrl = new Url({
      uniqueIdentifier: Date.now(),
      url: url,
    });

    newUrl.save((err) => {
      if (err) {
        return { error: "Database Error" };
      } else {
        return {
          original_url: newUrl.url,
          short_url: newUrl.id,
        };
      }
    });
  }
}
