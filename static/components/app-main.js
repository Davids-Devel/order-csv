var AppMain = {
	components:{
		"app-rows":AppRows,
		"app-fetch":AppFetch
	},
	template:`
	<div>
		<template v-if="step === 1">
			<h1>Inserte Un Archivo CSV</h1>
			<div style="position: relative; width: 300px; height: 300px; margin: auto;">
				<svg style ="position: absolute; z-index: 1; top: 34%; left: 34%;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100px" heigth="100px" fill="white">
 					<path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
				</svg>
				<div id="input">
					<input type="file" id="CSV" @change="onChange($event.target)">
				</div>
			</div>
		</template>
		<div id="rows" :style="dataToSend ? {top:0}:{top:'-100%'}">
			<app-rows v-if="step === 2" :data="dataToSend" :name="name"></app-rows>
		</div>
		<div :style="toast ? {top:'40px'}:{top:'-100px'}" id="toast">
			<span>{{message}}</span>
		</div>
	</div>`,
	data(){
		return {
			step:1,
			dataToSend:"",
			name:"",
			message:"",
			toast:false
		}
	},
	methods:{
		onChange(inputTarget){
			let file = inputTarget.files[0];

			let extension = file.name.split(".");

			this.name = file.name;

			extension = extension[extension.length -1];
			
			if (extension.toLowerCase() === "csv") {
				let reader = new FileReader();
				
				reader.readAsText(file);
				
				reader.addEventListener("load",({target})=>{
					this.dataToSend = target.result;
					setTimeout(()=>{
						this.step = 2;
					}, 300)
				}, false);
			} else {
				inputTarget.value = "";
				this.message = "Por Favor Ingrese Un Archivo CSV";
				this.toast = true;
				setTimeout(()=>{
					this.toast = false;
				}, 5000);
			}
		}
	}
}