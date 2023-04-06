const request = require("supertest");

const app = require("../app");
let db = require("../fakeDb");

let pickles = { name: "pickles", price: 2.00 };

beforeEach(function() {
  db.items.push(pickles);
});

afterEach(function() {
  const item = db.items.filter(item => item.name === pickles.name)[0];

  const itemIndex = db.items.indexOf(item);
  db.items.splice(itemIndex, 1);
  
});


/** GET /items - returns `{items: [pickles]}` */

describe("GET /items", function() {
  it("Gets a items", async function() {
    const resp = await request(app).get(`/items`);

    expect(resp.body).toEqual({ items: [pickles] });
  });
});

// end

/** GET /items/[name] - return data about one item: `{name: name, price: price}` */

describe("GET /items/:name", function() {
  it("Gets a single item", async function() {
    const resp = await request(app).get(`/items/${pickles.name}`)

    expect(resp.body).toEqual(pickles)
  });

  it(`Responds with 404 if the items doesn't exist in our database.`, async function () {
    const resp = await request(app).get('/items/fakefood')

    expect(resp.statusCode).toEqual(404);
  })
});

// end

/** POST /items/[name] - Add a new object into our shopping list: 
 * `{added: {name: name, price: price}}` 
 * */

describe("POST /items", function () {
  it('Creates a new item', async function () {
    const resp = await request(app)
      .post('/items')
      .send({
        name: 'fritos',
        price: 3
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      added: {
        name: 'fritos',
        price: 3
      }
    });
  });
  it('Does not a create a duplicate item', async function () {
    const resp = await request(app)
      .post('/items')
      .send({
        name: 'pickles',
        price: 3
      });
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      error: {
        message: "pickles already exists in your cart!",
        status: 400
      }
    });
  })
});

//end 

/** PATCH /items/[name] - update item; return {updated: [item]} */

describe('PATCH /items/:name', function () {
  it('updates a single item', async function () {
    const resp = await request(app)
      .patch(`/items/${pickles.name}`)
      .send({
        price: 3
      });
    expect(resp.body).toEqual({
      updated: {
        name: 'pickles',
        price: 3
      }
    });
  })
  it('Throws an error if you attempt to patch an item that does not exist', async function () {
    const resp = await request(app).patch('/items/nothere');
    expect(resp.statusCode).toEqual(404);
    })
  })

// end

/** DELETE /items/[name] - Delete item,
 *  return `{message: "Deleted"}` */

describe("DELETE /items/:name", function() {
  it("Deletes a single item", async function() {
    const resp = await request(app)
      .delete(`/items/${pickles.name}`);
    expect(resp.body).toEqual({ message: "Deleted" });
    expect(db.items.length).toEqual(1);
  });
  it('Throws an error if you attempt to delete an item that does not exist', async function () {
    const resp = await request(app)
      .delete('/items/nothere');
    expect(resp.statusCode).toEqual(404);
  })
});

// end