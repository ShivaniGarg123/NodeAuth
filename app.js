var brcypt=require("bcrypt");
var _=require("lodash");
var express=require("express");
var app=express();
//let apiRoutes=require('./routes/api-routes.js');
let mongoose=require("mongoose");

//SETTING UP BODY-PARSER FOR PARSING POST REQUESTS
let bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//CONNECT TO MONGOOSE AND SET UP CONNECTION VARIABLE
mongoose.connect("mongodb://localhost/ranger", { useNewUrlParser: true });
var db=mongoose.connection;
var schema=mongoose.Schema;
var uschema=new schema({
    name:{
        type:String,
        unique:false,
        required:true,
        minlength:5,
        maxlength:50
    },
    email:{
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:1024
    }
});
var User=mongoose.model("User",uschema);




app.get("/",(req,res)=>{
    res.send("hello world");
});
app.post("/addpost",async (req,res)=>{
   let user=await User.findOne({email: req.body.email});
   if(user) return res.status(400).send("user already registered ");
   user=new User(_.pick(req.body,['name','email','password']));
    const salt=await brcypt.genSalt(10);
    user.password=await brcypt.hash(user.password,salt);
    const validpassword=await brcypt.compare(req.body.password,user.password);
    if(!validpassword) return res.status(400).send("invalid password");

    res.send(true);
});




//GET EACH ITEM
app.get("/api/activity",(req,res)=>{
    User.find({}).then((eachOne)=>{
        res.json(eachOne);
    })
});





app.post("/update/:id",(req,res)=>{
    async function updateuser(id){
        const r=await User.findById(id);
        if(!r) return;
        r.name=req.body.name;
        const res=await r.save();
        console.log(res);
    }



    const t=updateuser(req.params.id);
    res.send(t);
});

app.listen(4760,()=>{
    console.log("server is running on port...");
});