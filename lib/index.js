class OrderByCI {
	constructor(CSV, {row, type, name}) {
		this._CII; //C.I. Index
		this._columnsNames;
		this._name = name;
		this._data = this.SplitIntoRowsAndColumn(CSV, row, type);
	}
	get FinalData() {
		return 	this._data;
	}
	SplitIntoRowsAndColumn(CSV, row, type){

		let Splitted = CSV.split(/\r\n|\n|\r/).map(e=>{
			return e.split(";");
		});
		this.ColumnIndex = Splitted[row];

		this.ColumnNames = Splitted.slice(0, row+1);

		return this.OrderByAscendant(Splitted.slice(row +1), row, type);
	}
	OrderByAscendant(splitted, row, type) {
		let order = splitted.sort((a, b)=>{
			if (a[this.ColumnIndex] === b[this.ColumnIndex]) {
				return 0;
			}
			else {
				return (a[this.ColumnIndex] < b[this.ColumnIndex]) ? -1 : 1;
			}
		})
		return this.Concat(order, type);
	}
	Concat(ArrayData, type) {
		let arrayConcat = [this.ColumnNames.join("\r\n")];

		if (type === "descendant")
			ArrayData = ArrayData.reverse();
		
		arrayConcat = arrayConcat.concat(ArrayData.map(e=>{
			return e.join(";")
		}));
		
		return arrayConcat.join("\r\n");
	}
	set ColumnNames(Row) {
		this._columnsNames = Row.map(e=>{
			return e.join(";");
		});
	}
	get ColumnNames() {
		return this._columnsNames;
	}
	set ColumnIndex(Rows) {
		Rows.forEach((e, i)=>{
			if (e === this._name) {
				this._CII = i;
			}
		});
	}
	get ColumnIndex() {
		return this._CII;
	}
}
module.exports = OrderByCI;