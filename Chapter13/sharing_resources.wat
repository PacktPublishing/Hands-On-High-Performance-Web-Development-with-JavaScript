(module
    (import "js" "mem" (memory 1))
    (func $storeNumber
        (i32.store (i32.const 0) (i32.const 100))
    )
    (func $readNumber (result i32)
        (i32.load (i32.const 0))
    )
    (export "readNumber" (func $readNumber))
    (export "storeNumber" (func $storeNumber))
)