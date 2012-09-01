##jdatatable

Simple table renderer for data in json format

## Usage example

	config = {
		td : {
			className : {
				first : 'table-body table-td-first',
				middle : 'table-body table-td-middle',
				last : 'table-body table-td-last'						
			}
		},
		th : {
			className : {
				first : 'table-header table-th-first',
				middle : 'table-header table-th-middle',
				last : 'table-header table-th-last'
			}
		},
		listener : function(table) {
			$(".link-button", table.getContainer()).button();
		}
	};
	
	$.dataTable.create("id",
		[{key:"name", label: "Name"}],
		[{"name":"data"},{"name":"table"}],
		config).render();
		
## methods create(sId, aColumns, aData, oConfig)
* `sId` Container id
* `aColumns` Array of object with properties key and label
* `aData` Array of object
* `oConfig` See example above
