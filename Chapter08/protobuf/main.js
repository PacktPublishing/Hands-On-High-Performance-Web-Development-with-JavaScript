import protobuf from 'protobufjs';
import json from '../schema/test.json';

const TestType = new protobuf.Type("TestType");
TestType.add(new protobuf.Field("item1", 1, "string"));
TestType.add(new protobuf.Field("item2", 2, "int32"));
TestType.add(new protobuf.Field("item3", 3, "float"));

if( TestType.verify(json) ) {
    throw Error("Invalid type!");
}

const message = TestType.create(json);
const buf = TestType.encode(message).finish();
const final = TestType.decode(buf);
console.log(buf.byteLength, Buffer.from(JSON.stringify(final)).byteLength);
console.log(buf, final);

protobuf.load('test.proto', function(err, root) {
    if( err ) throw err;

    const TestTypeProto = root.lookupType("exampleProtobuf.TestData");
    if( TestTypeProto.verify(json) ) {
        throw Error("Invalid type!");
    }

    const message2 = TestTypeProto.create(json);
    const buf2 = TestTypeProto.encode(message2).finish();
    const final2 = TestTypeProto.decode(buf2);
    console.log(buf2.byteLength, Buffer.from(JSON.stringify(final2)).byteLength);
    console.log(buf2, final2);
});