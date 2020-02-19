#include <stdio.h>
void fizzbuzz(int num) {
    for(int i = 1; i <= num; i++) {
        if(i%3 == 0) {
            printf("Fizz");
        }
        if(i%5 == 0) {
            printf("Buzz");
        }
    }
    printf("\n");
}