(module
    (import "console" "log" (func $log (param i32 i32)))
    (import "js" "mem" (memory 1))
    (global $g (mut i32) (i32.const 0))
    (func $checkFizz (param $p1 i32)
        local.get $p1
        i32.const 3
        i32.rem_s
        (if (i32.eq (i32.const 0))
            (then 
                (i32.store8 (global.get $g) (i32.const 70))
                (i32.store8 (i32.add (global.get $g) (i32.const 1)) (i32.const 105))
                (i32.store8 (i32.add (global.get $g) (i32.const 2)) (i32.const 122))
                (i32.store8 (i32.add (global.get $g) (i32.const 3)) (i32.const 122))
                (global.set $g (i32.add (global.get $g) (i32.const 4)))
            )
        )
    )
    (func $checkBuzz (param $p1 i32)
        local.get $p1
        i32.const 5
        i32.rem_s
        (if (i32.eq (i32.const 0))
            (then
                (i32.store8 (global.get $g) (i32.const 66))
                (i32.store8 (i32.add (global.get $g) (i32.const 1)) (i32.const 117))
                (i32.store8 (i32.add (global.get $g) (i32.const 2)) (i32.const 122))
                (i32.store8 (i32.add (global.get $g) (i32.const 3)) (i32.const 122))
                (global.set $g (i32.add (global.get $g) (i32.const 4)))
            )
        )
    )
    (func $fizzbuzz (param $p i32)
        (local $start i32)
        (local.set $start (i32.const 1))
        (block
            (loop
                (call $checkFizz (local.get $start))
                (call $checkBuzz (local.get $start))
                (br_if 1 (i32.eq (local.get $start) (local.get $p)))
                (local.set $start (i32.add (local.get $start) (i32.const 1)))
                (br 0)
            )
        )
        i32.const 0
        global.get $g
        call $log
    )
    (export "fizzbuzz" (func $fizzbuzz))
)