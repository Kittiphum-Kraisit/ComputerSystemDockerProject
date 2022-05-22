function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

function TodoListCard() {
    const [items, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(setItems);
    }, []);

    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );

    if (items === null) return 'Loading...';
        
    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} />
            {items.length === 0 && (
                <p className="text-center">No data yet, Add one using the form above</p>            
                )}
            {items.map(item => (
                <ItemDisplay
                    item={item}
                    key={item.id}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function AddItemForm({ onNewItem }) {
    const { Form, InputGroup, Button } = ReactBootstrap;
    const [newItem, setNewItem] = React.useState('');
    const [newdate, setnewdate] = React.useState('');
    const [newwind_direction, setnewwind_direction] = React.useState('');
    const [newatmospheric_pressure, setnewatmospheric_pressure] = React.useState('');
    const [newatmospheric_trend, setnewatmospheric_trend] = React.useState('');
    const [newincoming_rain_cloud, setnewincoming_rain_cloud] = React.useState('');
    const [newarea, setnewarea] = React.useState('');
    const [submitting, setSubmitting] = React.useState(false);
    const [newchance, setnewchance] = React.useState('');
    const submitNewItem = e => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify({ date: newdate,  wind_direction : newwind_direction, atmospheric_pressure : newatmospheric_pressure, atmospheric_trend : newatmospheric_trend , incoming_rain_cloud: newincoming_rain_cloud, area: newarea}),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setNewItem('');
                setSubmitting(false);
                setnewdate('');
                setnewwind_direction('');
                setnewatmospheric_pressure('');
                setnewatmospheric_trend('');
                setnewincoming_rain_cloud('');
                setnewarea('');
            });
    };

    return (
        <Form onSubmit={submitNewItem}>
            <p className="text-center"> Precipitation Chance Calulator </p> 
            <p className="text-left"> Date: </p>   
            <InputGroup className="mb-3">
                <Form.Control
                    value={newdate}
                    onChange={e => setnewdate(e.target.value)}
                    type="text"
                    placeholder="DD/MM/YYYY"
                    aria-describedby="basic-addon1"
                />
            </InputGroup>
            <p className="text-left"> Wind direction:   </p>   
            <InputGroup className="mb-3">
                <Form.Control
                    value={newwind_direction}
                    onChange={e => setnewwind_direction(e.target.value)}
                    type="text"
                    placeholder="N, S, W, E, NE, NW, SE, SW"
                    aria-describedby="basic-addon1"
                />
            </InputGroup>
            <p className="text-left"> atmospheric_pressure (atm):   </p>   
            <InputGroup className="mb-3">
                <Form.Control
                    value={newatmospheric_pressure}
                    onChange={e => setnewatmospheric_pressure(e.target.value)}
                    type="text"
                    placeholder="0"
                    aria-describedby="basic-addon1"
                />
            </InputGroup>
            <p className="text-left"> atmospheric_trend:   </p>   
            <InputGroup className="mb-3">
                <Form.Control
                    value={newatmospheric_trend}
                    onChange={e => setnewatmospheric_trend(e.target.value)}
                    type="text"
                    placeholder="stable, rising, falling"
                    aria-describedby="basic-addon1"
                />
            </InputGroup>
            <p className="text-left"> incoming_rain_cloud:   </p>  
            <InputGroup className="mb-3">
                <Form.Control
                    value={newincoming_rain_cloud}
                    onChange={e => setnewincoming_rain_cloud(e.target.value)}
                    type="text"
                    placeholder="true, false"
                    aria-describedby="basic-addon1"
                />
            </InputGroup>
            <p className="text-left"> area_size (km^2):   </p>  
            <InputGroup className="mb-3">
                <Form.Control
                    value={newarea}
                    onChange={e => setnewarea(e.target.value)}
                    type="text"
                    placeholder="0"
                    aria-describedby="basic-addon1"
                />
            </InputGroup>
            <Button
                    type="submit"
                    variant="success"
                    disabled={!newarea.length || !newincoming_rain_cloud.length || !newatmospheric_trend.length || !newatmospheric_pressure.length || !newwind_direction.length || !newdate.length}
                    className={submitting ? 'disabled' : ''}
                >
                    {submitting ? 'Adding...' : 'Add'}
                </Button>
            <p className="text-left"> </p>
            <p className="text-left"> available data: </p>  
        </Form>
    );
}

function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const { Container, Row, Col, Button } = ReactBootstrap;
    function calculate(wd, ap, apt, irc, area) {
        var C = 0;
        if(wd == 'S') {
            C += 0.5;
        } else if (wd == 'SE' || wd == 'SW') {
            C += 0.25;
        }
        C += parseInt(ap);
        if(apt == 'falling'){
            C += 1;
        } else if(apt == 'rising') {
            C += 0.25;
        }
        if(irc == 'true') {
            C+=1;
        }
        var result = 0;
        result = (C * parseInt(area))/100;
        return result;
    }

    const removeItem = () => {
        fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    return (
        <Container fluid className={`item ${item.completed && 'completed'}`}>
            <Row>
                <Col xs={10} className="name">
                    {item.date}, Precipitation Chance: {calculate(item.wind_direction, item.atmospheric_pressure, item.atmospheric_trend, item.incoming_rain_cloud, item.area)} %
                </Col>
                <Col xs={1} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        aria-label="Remove Item"
                    >
                        <i className="fa fa-trash text-danger" />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
