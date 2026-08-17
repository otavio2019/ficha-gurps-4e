import { describe, expect, it } from "vitest";
import { selectCloudBackedRecords } from "../shared/cloudSync";

describe("selectCloudBackedRecords", () => {
  it("não seleciona fichas locais para mutações na nuvem", () => {
    const records = [{ id: "local-1" }, { id: "cloud-1" }, { id: "cloud-2" }];

    expect(selectCloudBackedRecords(records, ["cloud-1", "cloud-2"])).toEqual([
      { id: "cloud-1" },
      { id: "cloud-2" },
    ]);
  });
});
