
const express = require('express')
const mongoose = require('mongoose'),
app = express();

//express session authors , is middleware (to get , res the current info) => signUp , sign in
const expressSession = require('express-session')

// cookie parser is middleware (تدير السيشن ومتابعة اليوزر)
const cookieParser = require('cookie-parser')

//passport=>  authentecation تسهل عملية 
const passport = require('passport')

const router = require ('./routes/index')

const seedBook = require("./book_seed");
const seedAuthor = require("./author_seed");

const Author = require("./models/author");
const Book = require("./models/book");


 // promise to ensure ... catch error  
 // global ==> access to use db in any file    
mongoose.Promise = global.Promise

// connection DB (url , properties connection)
mongoose.connect(
'mongodb+srv://mahadb:maha1312@cluster0.ghbvs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    )
    //insert from file
    // Book.insertMany(seedBook, (err, books) => {
    //       if (err){ console.log(err)}
    //         console.log("added provided books data", books)
    //         mongoose.connection.close();
    //     });

    //insert from file
    // Author.insertMany(seedAuthor, (err, authors) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log("add", authors);
    //     mongoose.connection.close();
    //     });

   //---------------------------
        //insert at least 2 new author and book
        // Author.insertMany([
        // { name: "Mohammed", age: 32,  nationality: "Saudi Arabia", image: "https://img.com" },
        // { name: "Maha", age: 26, nationality: "Saudi Arabia", image: "https://img.com" ,},
        // ]);
        
        // Book.insertMany([
        // { title: "book 1 ", pages: 100, price: 40, image: "https://img.com" },
        // { title: "book 2", pages: 80, price: 35, image: "https://img.com" },
        // ]);
        //---------------------------
        //Find all male authors => in console
        // Author.find({gender:"male"},(err,authors)=>{
        //     //in "male" = array of object 
        //     console.log("male",authors);
        // })
       
        // // Find all authors that age grater than 44
        // Author.find({age:{$gt: 44}},(err, authors) => {
        //     console.log("Authors that age grater than 44", authors);
        //   })
         
        // // Find all authors in Kuwait country
        // Author.find({nationality:"Kuwit"}, (err, authors) => {
        //     console.log("Kuwait", authors);
        // })

        // //--------------------
        // // Find all the books that start with L or l
        // Book.find({name:/^l/i},(err,books)=>{
        //     console.log("start with L or l",books);
        // })

        // // Find all the books that have pages more than 250Select with OR, AND
        // Book.find({pages:{$gt: 250}},(err,books)=>{
        //     console.log("pages more than 250",books);
        // })
        // // Find all authors that in Kuwait or Saudi Arabia
        // Author.find({$or:[{nationality:"Kuwit" },{ nationality: "Saudi Arabia" }]},(err,authors)=>{
        //     console.log("Kuwait or Saudi Arabia",authors);
        // })
        // Find all authors that have 3 books or more and their age grater than 35
        // Author.find({ books: { size: { $gt: 3 } }, age: { $gt: 35 } },
        //     (err, authors) => {
        //       console.log("Authors with +3 books and age +35", authors);
        //     })

            // Author.find({ age: { $exists: true } }, (err, authors) => {
            //     console.log("do not have a key of age", authors);
            //   });
              
            //   Author.find({ nationality: { $not: "Saudi Arabia" } }, (err, authors) => {
            //     console.log("are not from Saudi Arabia", authors);
            //   });
              
              // Author.updateOne(
              //   { name: "Osama Al Muslim" },
              //   { $set: { age: 45 } },
              //   (err, authors) => {
              //     console.log("Update Osama Al Muslim age to be 45", authors);
              //   }
              // );
              
              // Book.deleteMany({ price: { $lt: 50 } }, (err, res) => {
              //   console.log("Remove all book that have price less than 50", res);
              // });  
            ////////////////////////////////

// app.use to using the router
 
    app.use(express.json());
    //use => cookieParser(secretword)
    app.use(cookieParser('mylibrary'))

    //app.use => expressSession( secret, خصاص السيشن ....)
    app.use(expressSession({
        secret:'mylibrary',
        saveUninitialized: true,   //تحفظ بيانات السيشن في الداتابيس المخصصة لها
        resave: true, //تعيد حفظ بيانات السيشن بعد الوقت المحدد للسيشن
        cookie:{maxAge:6000} // maxAge 6 sec  الوقت اللي تنحفظ فيه السيشن
    }))
    ////////////////////////////////
    // اعدادات الباسبورت 
    //passport.initialize //تعطي قيم افتراضية لللسيشن
    app.use(passport.initialize())
    //passport.session => تعني انه الباسبورت يستخدم السيشن
    app.use(passport.session())
    ////////////////////////////////

    //User.createStrategy => (user sign in sign up) نعرف لليوزر ستراتيجي ، وهي الطريقة اللي نستخدمها للتعامل مع 
    passport.use(Author.createStrategy())
    // serializeUser تحفظ بيانات اليوزر في السيشن
    passport.serializeUser(Author.serializeUser())
    // deserialize تحذف بياانات اليوزر بعد انتهاء السيشن
    passport.deserializeUser(Author.deserializeUser())

    app.use('/',router);
    
    app.listen(3000, ()=>{
    console.log("express has started")
})
