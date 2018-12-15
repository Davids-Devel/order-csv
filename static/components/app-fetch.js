var AppFetch = {
	data(){
		return {
			dataToSend:this.$parent.dataToSend
		}
	},
	methods:{
		async sendFetch() {
			try {

				var serverResponse = await fetch("/order", {
					method:"POST",
					headers:{
						"Content-Type":"application/json"
					},
					body:JSON.stringify({
						content:this.dataToSend,
						order:"descendant",
						row:"cedula"
					})
				});
	
				var data = await serverResponse.text();
				
			} catch(err) {
				alert("Hubo un error al obtener la información");
				console.error(err);
			}
		}
	}
}