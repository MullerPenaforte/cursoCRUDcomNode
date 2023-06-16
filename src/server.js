const express = require('express');
const bodyParser = require('body-parser');
const programmer = require('./database/tables/programmer');

const app =  express();
const port = 5000;

/*app.get('/', (req, res) => {
    res.sendFile("index.html", {root: __dirname});   //caminho onde o diretório está __dirname
});
*/

app.use(bodyParser.json());  //suportar os json e as rotas que serão criadas
//as informações que serão passadas para o backend em formato json

app.get('/syncDatabase', async(req, res) =>{
    const database = require('./database/db');
    try{
        await database.sync();
        res.send('Database sucessfully sync');

    }catch(error){
        res.send(error);
    }
});

app.post('/createProgrammer', async (req, res) =>{
    try {
        const params = req.body;
        const properties = ['name', 'javascript', 'java' , 'python'];
        const check = properties.every((property)=>{
            return property in params;
        });
        if(!check){
            const propStr= properties.join(', ');
            res.send(`All parameters needed to create a programmer must be sent ${propStr}`);
            return; 
        }
        const newProgrammer = await programmer.create({
            name:params.name,
            javascript:params.javascript,
            java:params.java,
            phyton:params.phyton
        });

        res.send(newProgrammer);
    } catch (error) {
        res.send(error);
    }
});


app.get ('/retrieveProgrammer', async(req, res) =>{
    try {

        const params =  req.body;

        if('id' in params){
            const record = await programmer.findByPk(params.id);
        }
        if(record){
            res.send(record);
        }else{
            res.send('No programmer found using received ID.');
        }
        const record =  await programmer.findAll();
       return;
    } catch (error) {
        res.send(error);
    }
    
});




app.delete('/deleteProgrammer', async(req,res)=>{
    try {
        const params =  req.body;

        if(!('id' in params)){
            res.send('Missing id in request body');
            return;
        }
        
        const record = await programmer.findByPk(params.id);

        if(!record){
            res.send('Progammer ID not found');
            return;
        }
        await record.destroy(`${record.id} ${record.name} - Deletes successfully.`);
    } catch (error) {
       res.send(error); 
    }


  /*  app.put('/updateProgammer', async(req,res)=>{
        try {

            const params =  req.body;
            const record = await validateID(params);
            const properties = ['name', 'python', 'java', 'javascript'];
            if(!('id' in params)){
                const record= await programmer.findByPk(params.id);
            }
            
        } catch (error) {
            
        }
    })
    faltou tempo pra codar */ 


    app.put('/updateProgrammer', async (req, res) => {
        try {
          const params = req.body;
          const properties = ['id', 'name', 'javascript', 'java', 'python'];
          const check = properties.every((property) => {
            return property in params;
          });
          if (!check) {
            const propStr = properties.join(', ');
            res.send(`All parameters needed to update a programmer must be sent: ${propStr}`);
            return;
          }
      
          const existingProgrammer = await programmer.findByPk(params.id);
          if (!existingProgrammer) {
            res.send('Programmer ID not found');
            return;
          }
      
          existingProgrammer.name = params.name;
          existingProgrammer.javascript = params.javascript;
          existingProgrammer.java = params.java;
          existingProgrammer.phyton = params.phyton;
      
          await existingProgrammer.save();
      
          res.send(existingProgrammer);
        } catch (error) {
          res.send(error);
        }
      });
      
});   







app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});
