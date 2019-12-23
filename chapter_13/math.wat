(module 
    (import "math" "add" (func $externalAdd (param i32 i32) (result i32)))
    (func $add (param $p1 i32) (param $p2 i32) (result i32)
        local.get $p1
        local.get $p2
        i32.add
    )
    (func $add2 (param $p1 i32) (param $p2 i32) (result i32)
        local.get $p1
        local.get $p2
        call $externalAdd
    )
    (export "add" (func $add))
    (export "add2" (func $add2))
)