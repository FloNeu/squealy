from django.shortcuts import render

from squealy.views import SqlApiView
# Create your views here.

class DatabaseTableReport(SqlApiView):


    query = "select name, sql, 5 as num, 123 as some_column from sqlite_master limit 4;"
    format = "table"
    columns = {
        "name": {
            "type": "dimension",
        },
        "sql": {
            "type": "dimension",
        },
        "num": {
            "type": "metric",
        }
    }
    transformations = [
                       {"name": "merge", "kwargs": {"columns_to_merge": ["sql","some_column"], "new_column_name": "merged_column"}},
                        {"name": "split", "kwargs": {"pivot_column": "name"}}
    ]
    parameters = {"name": { "type": "string", "default_value": "asds"},
                  "date": {"type": "date", "format": "YYYY/MM/DD"},
                  "datetime": {"type": "datetime", "format": "YYYY/MM/DD HH:mm:ss", "optional": True}}

