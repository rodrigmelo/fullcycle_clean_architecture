import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "productName",
      price: 1,
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("productName");
    expect(response.body.price).toBe(1);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "productName",
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    const response = await request(app).post("/product").send({
      name: "productName1",
      price: 1,
    });
    expect(response.status).toBe(200);

    const response2 = await request(app).post("/product").send({
      name: "productName2",
      price: 2,
    });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);

    const firstProduct = listResponse.body.products[0];
    expect(firstProduct.name).toBe("productName1");
    expect(firstProduct.price).toBe(1);

    const secondProduct = listResponse.body.products[1];
    expect(secondProduct.name).toBe("productName2");
    expect(secondProduct.price).toBe(2);

    const listResponseXML = await request(app)
      .get("/product")
      .set("Accept", "application/xml")
      .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(
      `<?xml version="1.0" encoding="UTF-8"?>`
    );
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>productName1</name>`);
    expect(listResponseXML.text).toContain(`<price>1</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>productName2</name>`);
    expect(listResponseXML.text).toContain(`<price>2</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`</products>`);
  });
});
