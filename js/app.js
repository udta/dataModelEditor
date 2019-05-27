var App = function() {

    var settings = {
        csvInput: $('.csv-file'),
        reader: new FileReader(),
        document: $(document),
        actionBtns: $('.action-btns'),
        dwldCsvBtn: $('.gen-csv'),
        tdItem: $('.td')
    };

    function _processFile($input) {
        var file = $input[0].files[0];

        settings.reader.readAsText(file, 'UTF-8');
        settings.reader.onload = _uploadFile;
    }

    function _generateCSV(button) {
        href = button.attr('href');

        var heads = $('.page-wrap table thead th').map(function(index, head) {
                return $(head).text();
            });

        var csvData = $('.page-wrap table tbody tr').map(function(i, v) {
                var $td = $('td', this);
                var csvObj = { };

                $(heads).each(function(index, head) {
                        csvObj[head] = $($td[index]).text();
                    });

                return csvObj;
            }).get();


        var data = '';

        /*Title*/
        for ( let i = 0; i < heads.length; i++ ) {
            data += (i>0 ? ';' : '') + heads[i]
        }

        /*Body*/        
        csvData.forEach(line => {
            let j = 0; 
            if ( settings.csvInput[0].files[0].name.match('dataModel_') ) {
                if ( (line['NAME'] === undefined || line['NAME'] === '') ) {
                    console.warn("Name is empty !!!!!!!!!!")
                } else {

                    data += '\n';

                    /*Same older with title*/
                    for ( var a in line ) {
                        data += (j > 0 ? ';' : '') + line[a]
                        j++
                    }
                }
            } else if ( settings.csvInput[0].files[0].name.match('codecList_') ) {

                //TODO.....
                data += '\n';

                /*Same older with title*/
                for ( var a in line ) {
                    data += (j > 0 ? ';' : '') + line[a]
                    j++
                }
            }
        })


        /*Output CSV file*/
        if ( navigator.userAgent.match('(rv:11.0|Edge)') ) {
            /*IE 11 or Edge*/

            var csv_file;
            try {
                csv_file = new Blob( [ data ], { type: 'text/plain' });
            } catch (e) {
                // Old browser, need to use blob builder
                window.BlobBuilder = window.BlobBuilder || window.MSBlobBuilder;
                if ( window.BlobBuilder ) {
                    var tmp = new BlobBuilder('text/plain');
                    tmp.append(data);
                    csv_file = tmp.getBlob();
                }

            }

            if ( window.navigator && window.navigator.msSaveBlob ) {
                window.navigator.msSaveBlob(csv_file, settings.csvInput[0].files[0].name);
            }

            delete csv_file;

        } else {

            var csv_file = new Blob( [ data ], { type: 'text/plain' });
            var b = document.createElement('a');
            var ev = document.createEvent('MouseEvents');
            ev.initEvent("click", false, false);
            b.href = URL.createObjectURL(csv_file);
            b.download = settings.csvInput[0].files[0].name;
            b.dispatchEvent(ev)

            delete b;
            delete csv_file;
        }
    }

    function _uploadFile(event) {
        var result = event.target.result,
            fileName = settings.csvInput[0].files[0].name;

	var lastObjectName = null;
        var lastName = null;
        var lastColor = 'white';
        let title = true;
        let data = '<table id="table" class="table table-bordered table-hover">'

        result.split('\n').forEach(line => {

            if ( title ) {
                var t = '<thead><tr>'
                line.split(';').forEach(p => {
                    t += '<th>' + p + '</th>'
                })
                t += '</tr></thead>'
                data += t;
                title = false;
                data += '<tbody>'
            } else {

                let array = line.split(';');

                if ( line.match(";object;") ) {
                    data += '<tr style="background:yellow">'
                    lastObjectName = array[0]
                } else {
                    /*TODO:相同名字用相同颜色, 不同名字间隔使用白色和另一种颜色*/
                    
                    if ( lastName !== array[0] ) {                        
                        if ( lastColor === 'white' ) {
                            lastColor = '#CCFFCC'
                        } else {
                            lastColor = 'white'
                        }
                    }
                    data += '<tr style="background:' + lastColor + '">'

                    lastName = array[0];
                }

                let index = 0;
                let paramName = '';
                array.forEach(p => {
                    if ( index === 0 /*|| index === 7 || index === 8*/ ) {
                        data += '<td contenteditable="true" style="word-break: keep-all; white-space: nowrap;" data-tippy-content="' + lastObjectName + '">' + p + '</td>'
                        paramName = p;
                    } else {
                        data += '<td contenteditable="true" data-tippy-content="' + lastObjectName + paramName + '">' + p + '</td>'
                    }
		    index++
                })

                data += '</tr>'
            }
        })

        data += '</tbody></table>'

        $('.page-wrap').html(data);
        $('.page-wrap').height( $('#menu').height() - 5 );
        $('.page-wrap').width(window.screen.availWidth);

        $(window).resize(function() {
            $('.page-wrap').height( $('#menu').height() - 5 );
            $('.page-wrap').width(window.screen.availWidth);
        });
        settings.actionBtns.show();
        tippy('td');
    }

    function _sortTable(header, index) {
        var $tbody = $('table tbody');
        var order = $(header).attr('data-order');

        var sortedHtml = $tbody.find('tr').sort(function(a, b) {
                var tda = $(a).find('td:eq(' + index + ')').text();
                var tdb = $(b).find('td:eq(' + index + ')').text();
                //Order according to order type
                return (order === 'asc' ? (tda > tdb ? 1 : tda < tdb ? -1 : 0) : (tda < tdb ? 1 : tda > tdb ? -1 : 0));

            });

        $tbody.html(sortedHtml);
    }

    return {

           init: function() {
            this.bindUI();
        },

           bindUI: function() {

            settings.csvInput.on('change', function(e) {

                    var $self = $(this);

                    if ( $self.val() ) {
                        _processFile($self);
                    };
                });

            //settings.document.on('click', '.table-responsive table thead th', function(){
            //    //Add parameter for remembering order type
            //    $(this).attr('data-order', ($(this).attr('data-order') === 'desc' ? 'asc':'desc'));
            //   //Add aditional parameters to keep track column that was clicked
            //   _sortTable(this, $('.table-responsive table thead th').index(this));
            //});

            settings.dwldCsvBtn.on('click', function(e) {
                    e.preventDefault();
                    _generateCSV($(this));
                });

            //$(document).on('click', '.delete-row', function ( e ) {
            //	e.preventDefault();
            //	$(this).closest('tr').remove();
            //});
        },

           hotkey: function(event) {
            if ( event.altKey ) {
                if ( window.event.keyCode == 81 ) {
                    /*ALT+Q*/
                    event.preventDefault();
                    if ( currentItem ) {
                        var target = $(currentItem).parents()[0]; //tr
                        //target.previousSibling.append(<tr></tr>);
                        $(target).after('<tr>\
                                    <td contenteditable="true"></td>\
                                    <td contenteditable="true"></td>\
                                    <td contenteditable="true"></td>\
                                    <td contenteditable="true"></td>\
                                    <td contenteditable="true"></td>\
                                    <td contenteditable="true"></td>\
                                    <td contenteditable="true"></td>\
                                    <td contenteditable="true"></td>\
                                    <td contenteditable="true"></td>\
                                    <td contenteditable="true"></td>\
                                    <td contenteditable="true"></td>\
                                    <td contenteditable="true"></td>\
                                    </tr>');
                    }
                } else if ( window.event.keyCode == 87 ) {
                    /*ALT+W*/
                    event.preventDefault();
                    if ( currentItem ) {
                        var target = $(currentItem).parents()[0]; //tr
                        currentItem = target.nextSibling.children[0] ? target.nextSibling.children[0] : null;
                        target.remove();
                    }
                }

            }
        }
    }
}
    
