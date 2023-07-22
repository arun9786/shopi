const express = require('express');
const bodyParser = require('body-parser');
const axios=require('axios');

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.post('/api/pincode', (req, res) => {
    let pincode=req.body.pincode;
    let url= 'http://www.postalpincode.in/api/pincode/'+pincode;
    axios.get(url)
    .then(response => {
        res.json({response:response.data})
    })
    .catch(error => {
        res.json({error:error})
    });
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});