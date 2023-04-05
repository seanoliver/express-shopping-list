/** Routes for sample app. */

const express = require("express");

const db = require("../fakeDb");
const router = new express.Router();

/** GET /items: return list list of shopping items */
router.get("/", function (req, res) {
  return { "items" : res.json(db) }
});

/** POST /items: accept JSON body, add item, and return it
 *
 *  Input:
 *    {name: "popsicle", price: 1.45}
 *
 *  Output:
 *    {added: {name: "popsicle", price: 1.45}}
 */
router.post("/", function (req, res) {
  const newItemObj = req.body;
  db.items.push(newItemObj);

  return res.json({ "added" : newItemObj })
});

/** GET /:name : Return JSON of item
 *
 *    Output:
 *      {name: "popsicle", "price": 1.45}
 */

router.get('/:name', function (req, res) {
  const item = db.items.filter(item => item.name === req.params.name)[0];
  console.log('item', item);
  return res.json(item);
});

/** PATCH /items/:name: accept JSON body, modify item, return it
 *
 *  Input:
 *    {name: "new popsicle", price: 2.45}
 *
 *  Output:
 *    {updated: {name: "new popsicle", price: 2.45}}
 *
 */
router.patch('/:name', function (req, res) {
  const item = db.items.filter(item => item.name === req.params.name)[0];


  for (const key in req.body) {
    console.log('req.body.key', req.body.key, 'req.body', req.body);
    item[key] = req.body[key];
  };

  return res.json({ "updated" : item });

});


/** DELETE /items/:name : delete item
 *
 *    Return:
 *      {message: Deleted}
 *
*/
router.delete("/:name", function (req, res) {
  const item = db.items.filter(item => item.name === req.params.name)[0];
  console.log('item', item);

  const itemIndex = db.items.indexOf(item);
  db.items.splice(itemIndex, 1);

  console.log('db.items', db.items);

  return res.json({ message: "Deleted" });
});

module.exports = router;