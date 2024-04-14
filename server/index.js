const express = require("express");
const cors = require("cors");
const pdf = require("html-pdf");
const pdfSample = require("./pdf-sample");
const mongoose=require("mongoose")
const ResumeRoutes=require('./routes/index');
const app = express();
const uri="mongodb+srv://Rohi:EgWbIbD27nNOQipJ@cluster0.eqsiiyv.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(uri);
const con=mongoose.connection;
con.once("open", () => {
  console.log("Mongo DB connected");
});
const port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { template1, template2 } = require('./pdf-sample/index');

app.post("/create-pdf/:id", (req, res) => {
  const {  data } = req.body;
  const { id } = req.params; // Extract id from route parameters

  // Select template based on id
  let selectedTemplate;
  if (id === 'template1') {
    selectedTemplate = template1;
  } else if (id === 'template2') {
    selectedTemplate = template2;
  } else {
    return res.status(400).send("Invalid template id");
  }

  pdf.create(selectedTemplate(data), {}).toFile("Resume.pdf", (err) => {
    if (err) {
      res.send(Promise.reject());
      console.log(err);
    }
    res.send(Promise.resolve());
    console.log("Success");
  });
});

app.get("/fetch-pdf", (req, res) => {
  res.sendFile(`${__dirname}/Resume.pdf`);
});
app.use('/',ResumeRoutes)
app.get('/',(req,res)=>{
  res.send("Welcome");
})
app.use(express.static("../client/build"));


  app.listen(port, () => {
    console.log(`server is running on port:${port}`);
  });
