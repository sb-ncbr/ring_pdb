import pytest
from api.app import app


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_get_hello_world(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.json == {'hello': 'world'}
