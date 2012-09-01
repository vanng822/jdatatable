/*
 * Copyright (c) 2011 Nguyen Van Nhu
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function($) {

	/**
	 * Usage example
	 * $.dataTable.create("id",[{key:"name", label: "Name"}],[{"name":"data"},{"name":"table"}],config).render();
	 * @see DataTable
	 */
	$.dataTable = {
		create : function(sId, aColumns, aData, oConfig) {
			var config = $.extend(defaultConfig, oConfig);
			config.browser = $.browser;
			return new DataTable(sId, aColumns, aData, config);
		}
	};
	
	var defaultConfig = {
		table : {
			attributes : {
				cellpadding : 0,
				cellspacing : 0
			}
		},
		td : {
			className : {
				first : 'first',
				middle : 'middle',
				last : 'last'
			}
		},
		th : {
			className : {
				first : 'first',
				middle : 'middle',
				last : 'last'
			}
		},
		listener : function(dataTableObject) {
			/* example of creating buttons on all links in the table when the table is rendered :
				$("a", dataTableObject.getContainer()).button();
			*/
		},
		browser : null
	};

	/**
	 * This class is independent of JQuery
	 * It can be used to render a html table
	 * 
	 * @param sId <String>
	 * The id of the container or the HTMLElement
	 * @param aColumns <Array>
	 *	Array of array config [{key:"key", label: "label", formatter: fn},{key:"key", label: "label", formatter: fn}, ...]
	 * @param aData <Array>
	 * Array of json
	 * @param oConfig <Object>
	 * @see defaultConfig above
	 */
	var DataTable = function(sId, aColumns, aData, oConfig) {
		this._config = oConfig;
		this._columns = aColumns;
		this._tdRenderer = new TableRow("td", this._columns, this._config.td);
		this._thRenderer = new TableRow("th", this._columns, this._config.th);
		this._id = sId;
		this._data = aData;
		this._listeners = [];

		if (this._config.listener) {
			this.addListener(this._config.listener);
		}
	};

	DataTable.prototype = {
		_dispatchEventRendered : function() {
			for ( var i = 0, len = this._listeners.length; i < len; i++) {
				this._listeners[i](this);
			}
		},
		render : function() {
			var container = this.getContainer();
			if (container) {
				var tbl = document.createElement("table");
				var tbody = document.createElement("tbody");
				var thead = document.createElement("thead");
				var attributes = this._config.table.attributes;
				if (attributes) {
					for ( var key in attributes) {
						if (tbl.setAttribute) {
							tbl.setAttribute(key, attributes[key]);
						} else {
							try {
								tbl[key] = attributes[key];
							} catch(e) {
							}
						}
					}
				}
				thead.appendChild(this._thRenderer.render({}));
				for ( var i = 0, len = this._data.length; i < len; i++) {
					tbody.appendChild(this._tdRenderer.render(this._data[i]));
				}
				tbl.appendChild(thead);
				tbl.appendChild(tbody);
				if (this._config.browser
					&& this._config.browser.msie
					&& this._config.browser.version < 8) {
					var wrapper = document.createElement("div");
					wrapper.appendChild(tbl);
					container.innerHTML = wrapper.innerHTML;
					delete wrapper;
				} else {
					container.innerHTML = "";
					container.appendChild(tbl);
				}
			}
			this._dispatchEventRendered();
		},
		addRow : function(oRowData) {
			this._data.push(oRowData);
			return this;
		},
		addRows : function(aData) {
			for ( var index in aData) {
				this._data.push(aData[index]);
			}
			return this;
		},
		setData : function(aData) {
			this._data = aData;
			return this;
		},
		getContainer : function() {
			try {
				if (typeof this._id == "string") {
					return document.getElementById(this._id);
				} else if (typeof this._id == "object") {
					return this._id;
				}
			} catch (e) {
			}
			return null;
		},
		addListener : function(fn) {
			for ( var i = 0, len = this._listeners.length; i < len; i++) {
				if (this._listiners[i] == fn) {
					return;
				}
			}
			this._listeners.push(fn);
			return this;
		},
		removeListener : function(fn) {
			if (!fn) {
				this._listeners = [];
				return this;
			}
			for ( var i = 0, len = this._listeners.length; i < len; i++) {
				if (this._listeners[i] == fn) {
					delete this._listeners[i];
				}
			}
			return this;
		}
	};

	var TableRow = function(tag, columns, config) {
		if (tag == 'td') {
			this._tag = 'td';
		} else {
			this._tag = 'th';
		}
		this._columns = columns;
		this._config = config;
	};

	TableRow.prototype = {
		render : function(rowData) {
			var tr = document.createElement("tr");
			for ( var i = 0, len = this._columns.length; i < len; i++) {
				var column = this._columns[i];
				var td = document.createElement(this._tag);
				if (i == 0) {
					td.className = this._config.className.first;
				} else if (i < len - 1) {
					td.className = this._config.className.middle;
				} else {
					td.className = this._config.className.last;
				}
				if (typeof this._config.className[column.key] != "undefined") {
					td.className += " " + this._config.className[column.key];
				}
				if (this._tag == "td") {
					if (column.formatter) {
						td.innerHTML = column.formatter(rowData, column);
					} else {
						td.innerHTML = rowData[column.key];
					}
				} else {
					td.innerHTML = column.label ? column.label : column.key;
				}
				tr.appendChild(td);
			}
			return tr;
		}
	};
})(jQuery);