var AppRows = {
	template:`<div style="z-index:4; animation:fade .6s ease">
		<img v-if="selected" @click="back()" src="../images/arrow-left.svg" style="top: 55px; position: absolute; left: 200px; z-index: 3; cursor: pointer;"/>
		<div style="background: var(--green-mid); height: 100%; position: absolute; width: 27.65%; z-index: 2; left:0"></div>
		<div style="background: var(--green-mid); height: 100%; position: absolute; width: 27.65%; z-index: 2; right:0"></div>

		<h1 style="z-index: 2; position: relative;">Seleccione la Columna a Ordenar</h1>
		<div :style="selected?{height:'74px'}:{height:rows.length*69 + 'px'}" style="transition:ease .4s; padding: 10px 30px; display: grid; background: #f7f7f7; width: 40%; margin: 100px auto 0 auto; border-radius: 5px;">
			<template v-if="!selected">	
				<div style="transition: ease .6s" :style="'transform:'+columnTwo">
					<template v-for="row in rows">
						<div :id="'row-'+row" style="background: var(--green-dark); padding: 10px; text-align:center;margin:10px 0;cursor:pointer;" @click="selectRow(row)">
							<span style="color: white; font-size: 30px; font-family: Helvetica;">{{capitalize(row)}}</span>
						</div>
					</template>
				</div>
			</template>
			<template v-else>
				<div :style="'transform:'+rowSelected" style="transition:ease .6s;background: var(--green-dark); padding: 10px; text-align:center;margin:10px 0;">
					<span style="color: white; font-size: 30px; font-family: Helvetica;">{{capitalize(columnSelected)}}</span>
				</div>
			</template>
		</div>
		<template v-if="selected">
			<div :style="'opacity:'+orderSelect" style="transition: ease .6s">
				<h1>Orden</h1>
				<select v-model="order" style="background: white; border: none; border-radius: 5px; display: block; margin: 0 auto 50px auto; width: 20%; height: 30px; color: var(--green-dark); font-size: 18px; text-align: center; padding-left: 10px;">
					<option value="ascendant">Ascendente</option>
					<option value="descendant">Descendente</option>
				</select>
				<button :download="name" style="display:block; cursor:pointer; margin:0 auto 50px auto; background: white; border: none; border-radius: 50px; padding: 8px 50px; font-size: 18px; color: var(--green-dark-two);" @click="fetch()">Ordenar</button>
			</div>
		</template>
	</div>`,
	props:{
		data:{
			type:String,
			required:true,
			default:""
		},
		name:{
			type:String,
			required:true,
			default:""
		}
	},
	data() {
		return {
			rowSelected:"translateX(500px)",
			orderSelect:"0",
			rowIndex: undefined,
			columnSelected:"",
			selected:false,
			order:"",
			columnTwo:"translateX(0)"
		}
	},
	computed:{
		rows() {
			let tableRows = this.data.split(/\r\n|\n|\r/);

			tableRows.forEach((e, i)=> {
				e.split(";").forEach(ev=>{
					if (ev.match(/cedula|cédula|ci|c\.i\./i)) {
						this.rowIndex = i;
					}
				});
			});
			return tableRows[this.rowIndex].split(";");
		}
	},
	methods:{
		async fetch() {
			let request = await fetch("/order", {
				method:"POST",
				headers:{
					"Content-Type":"application/json"
				},
				body:JSON.stringify({
					name:this.name,
					row:this.rowIndex,
					content:this.data,
					type:this.order,
					columnName:this.columnSelected
				})
			});
			let text = await request.text();
			console.log(text)
			let data = new Blob(text.split(/\n|\r\n|\r/), {
				type:"text/plain"
			});

			this.descargarArchivo(data, "Ordened-"+this.name)

		},
		descargarArchivo(contenidoEnBlob, nombreArchivo) {
		  //creamos un FileReader para leer el Blob
		  var reader = new FileReader();
		  //Definimos la función que manejará el archivo
		  //una vez haya terminado de leerlo
		  reader.onload = ({target}) => {
		    //Usaremos un link para iniciar la descarga 
		    var save = document.createElement('a');
		    save.href = target.result;
		    save.target = '_blank';
		    //Truco: así le damos el nombre al archivo 
		    save.download = nombreArchivo || 'archivo.dat';
		    var clicEvent = new MouseEvent('click', {
		      'view': window,
		      'bubbles': true,
		      'cancelable': true
		    });
		    //Simulamos un clic del usuario
		    //no es necesario agregar el link al DOM.
		    save.dispatchEvent(clicEvent);
		    //Y liberamos recursos...
		    (window.URL || window.webkitURL).revokeObjectURL(save.href);
		  };
		  //Leemos el blob y esperamos a que dispare el evento "load"
		  reader.readAsDataURL(contenidoEnBlob);
		},
		capitalize(string) {
			return string.split(" ").map(e=>{
				return e[0].toUpperCase() + e.slice(1);
			}).join(" ");
		},
		filterSpaces(string) {
			return string.split(/\s/g).join("-");
		},
		back(){
			let _this = this;
			this.rowSelected = "translateX(500px)"
			this.orderSelect = "0";
			setTimeout(()=>{
				_this.columnSelected = "";
				_this.selected = false;
			}, 590);
			setTimeout(()=>{
				this.columnTwo="translateX(0)"
			}, 610);
		},
		selectRow(string) {
			let _this = this;
			this.columnSelected = string;
			this.columnTwo="translateX(-500px)"
			this.rowSelected = "translateX(500px)"
			this.orderSelect = "0";
			setTimeout(()=>{
				this.orderSelect = "1";
				this.rowSelected = "translateX(0)";
			}, 600);
			setTimeout(()=>{
				_this.selected = true;
			}, 550);
		}
	}
}