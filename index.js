const express = require("express"),
	  app = express(),

	  {writeFileSync, unlinkSync} = require("fs"),
	  {join} = require("path"),
	  {exec} = require("child_process"),
	  Order = require("./lib");
	  public = join(__dirname, "static");

app
	.use("/", express.static(public))
	.use(express.json());

app
	.get("/",(req, res) => {
		res.header({
			"Content-Type":"text/html; charset=utf8"
		});
		res.status(200).sendFile("index.html");
	})
	.get("*.js",({url}, res) => {
		res.header({
			"Content-Type":"text/javascript"
		})
		res.sendFile(url);
	})
	.get("*.css",({url}, res) => {
		res.header({
			"Content-Type":"text/css"
		})
		res.sendFile(url);
	})
	.get("*.svg",({url}, res)=>{
		res.header({
			"Content-Type":"image/svg+xml"
		})
		res.sendFile(url);
	})
	.post("/order", ({body}, res) => {
		let {content, row, name, type, columnName} = body;
		let order = new Order(content, {row, type, name:columnName});
		writeFileSync(`./temp/${name}`, order.FinalData);
		res.header({
			"Content-Type":"text/plain; charset=UTF-8"
		})
		res.sendFile(join(__dirname, `temp`, name), () =>{
			unlinkSync(join(__dirname, "temp", name));
		});
	})
	.listen(1293, ()=> {
		console.log(`Listen on http://localhost:1293`);
		exec("start http://localhost:1293");
	});