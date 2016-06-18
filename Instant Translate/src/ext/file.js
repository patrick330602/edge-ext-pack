/**
 * Created by chernikovalexey on 16/05/16.
 */


(function (undefined) {

    pl.extend(ke.ext.file, {
        downloadAsCSV: function (string, file_name) {
            var textFileAsBlob = new Blob([string], {
                type: 'text/plain'
            });

            if (ke.isEdge) {
                window.navigator.msSaveBlob(textFileAsBlob, file_name + '.csv');
            } else {
                var downloadLink = document.createElement("a");

                downloadLink.download = file_name + '.csv';
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.style.display = "none";
                downloadLink.onclick = function (e) {
                    document.body.removeChild(e.target);
                };

                document.body.appendChild(downloadLink);
                downloadLink.click();
            }
        }
    });

})();