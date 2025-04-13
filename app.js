const express=require("express");
const mongoose=require("mongoose");
const app=express();
const listing =require("./models/listing.js");
const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");


main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/hotels');
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
    res.send("this is root path");
});
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await listing.find({});
    res.render("index.ejs",{allListings:allListings})
   
    
    
}));
app.get("/listings/new",(req,res)=>{
    res.render("new.ejs")
   
    
    
});
app.post("/listings",wrapAsync(async(req,res)=>{
  

        
        const newListing=new listing(req.body.listingfeild)
        newListing.save();
        res.redirect("/listings");
   
   
    
    
}));

app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listingdata =await listing.findById(id);
    res.render("show.ejs",{listingdata:listingdata})
   
    
    
}));
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listingdata =await listing.findById(id);
    res.render("edit.ejs",{listingdata:listingdata});

   
    
    
}));
app.put("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listingfeild});
    res.redirect("/listings");



}))
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deleteedlisting=await listing.findByIdAndDelete(id);
    res.redirect("/listings");


}))
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {statusCode,message} =err;
    res.status(statusCode).send(message);
})

app.listen(8080,(req,res)=>{
    console.log("Server is Listening At the Port 8080")
});