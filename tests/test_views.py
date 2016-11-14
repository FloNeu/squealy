from __future__ import unicode_literals
from django.test import TestCase, RequestFactory
from example.exampleapp.views import DatabaseTableReport

class SqlApiViewTest(TestCase):
    def test_get(self):
        # factory = APIRequestFactory()
        # request = factory.get('/example/table-report/')
        factory = RequestFactory()
        request = factory.get('/example/table-report/?name=testname')
        response = DatabaseTableReport.as_view()(request)
        self.assertEqual(response.status_code, 200)
        #response.render()
        #print response.data
