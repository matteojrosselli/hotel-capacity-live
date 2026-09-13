import { describe, expect, it } from "vitest";
import { normalizeHiltonProperty, sumRoomAvailability } from "@/lib/connectors/hilton/shop";

describe("Hilton shop normalization", () => {
  it("sums max availability per room type", () => {
    const total = sumRoomAvailability({
      roomRates: [
        { roomTypeCode: "K1", numRoomsAvail: 5 },
        { roomTypeCode: "K1", numRoomsAvail: 8 },
        { roomTypeCode: "Q1", numRoomsAvail: 3 },
      ],
    });
    expect(total).toBe(11);
  });

  it("normalizes property capacity from shop response", () => {
    const row = normalizeHiltonProperty(
      {
        propCode: "ORDCH",
        name: "Hilton Chicago O'Hare Airport",
        airportCode: "ORD",
        roomsTotal: 369,
      },
      {
        roomRates: [
          { roomTypeCode: "K1", numRoomsAvail: 40 },
          { roomTypeCode: "Q1", numRoomsAvail: 20 },
        ],
      },
    );

    expect(row.propertyId).toBe("hilton-ordch");
    expect(row.roomsAvailable).toBe(60);
    expect(row.roomsSold).toBe(309);
    expect(row.airportCode).toBe("ORD");
  });
});
