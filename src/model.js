function Model(properties, Box2D) {
    const scale =  properties.scale;
    const model =  {
        properties: properties,
        body: new Box2D.b2BodyDef(),
        shape: null
    }
    model.body.userData = properties;
    if (properties.type == "passive") { 
        return model;
    }

    if (properties.fixed) {
        model.body.fixedRotation = true;
    }
    else {
        model.body.set_angularDamping(2.6); //2.6;
        model.body.fixedRotation = false;
    }
    if (properties.type == "static" || properties.type == "sensor") {
        model.body.set_type(Box2D.b2_staticBody);
    }
    else if (properties.type == "kinematic") {
        model.body.set_type(Box2D.b2_kinematicBody);
    }
    else {
        model.body.set_linearDamping(.2);
        model.body.set_type(Box2D.b2_dynamicBody);
    }

    if (properties.shape == "circle") {
        model.shape = new Box2D.b2CircleShape();
        model.shape.m_radius = properties.radius/scale;
    }
    else {
        const shape = new Box2D.b2PolygonShape();
        if (properties.shape == "rectangle") {
            shape.SetAsBox(properties.width/properties.scale/2, properties.height/properties.scale/2);
        }
        else if (properties.verts) {
            //console.log(shape)
            const b2Verts= [];
            for (var i = 0; i < properties.verts.length; i+=2) {
                let x = properties.verts[i]/properties.scale;
                let y = properties.verts[i+1]/properties.scale;

                var v = new Box2D.b2Vec2(x, y);
                b2Verts.push(v);
            }

            // https://github.com/Birch-san/box2d-wasm/discussions/29
            const [vecArr, destroyVecArr] = Box2D.pointsToVec2Array(b2Verts);

            shape.Set(vecArr, b2Verts.length);
            destroyVecArr();
        }
        else {
            console.error('b2PolygonShape mssing vertices');
            return null;
        }
        model.shape = shape;
    }
    return model;

}

export default Model