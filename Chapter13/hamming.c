#include <math.h>

const int INT_SIZE = sizeof(int) * 8;

void placeBits(int data, int* parity) {
    int currentDataLoc = 1;
    int dataIterator = 0;
    for(int i = 1, j = 0; i < INT_SIZE; i++, j++) {
        if(ceil(log2(i)) == floor(log2(i))) continue; //we are at a parity bit section
        *parity |= ((data & (currentDataLoc << dataIterator)) << (j - dataIterator));
        dataIterator++;
    }
}

void createParity(int* data) {
    // now, based off of our current number is what tells us how we check for each parity bit location
    int parityChecks[4] = {1, 2, 4, 8};
    int bitSet[4] = {1, 2, 8, 128};
    for(int i = 0; i < 4; i++) {
        int count = 0;
        for(int j = 0; j < INT_SIZE; j++) {
            // we are at a location to test if there is a 0
            if((parityChecks[i] & (j+1)) != 0) {
                count += ((*data & (1 << j)) != 0) ? 1 : 0;
            }
        }
        if( count % 2 != 0 ) {
            *data |= bitSet[i];
        }
    }
}

// creation of true data point with parity bits attached
int createData(int data) {
    int num = 0;
    // parity is at locations 1,2,4,8 so we need to grab values from data and store them at 3,5,6,7,9,10,11,12,13,14,15
    // first we place the bits
    placeBits(data, &num);
    createParity(&num);
    return num;
}

// return based off of passed in value, 0 is good (even parity), 1 is bad (we found odd parity)
int checkRow(int* data, int loc) {
    int count = 0;
    int verifier = 1;
    for(int i = 1; i < INT_SIZE; i++) {
        // we have a parity location
        if((loc & i) != 0 ){
            count += (*data & (verifier << (i - 1))) != 0 ? 1 : 0;
        }
    }
    return count % 2;
}

int checkAndVerifyData(int data) {
    int verify = 0;
    int parityChecks[4] = {1, 2, 8, 128};
    for(int i = 0; i <= 4; i++) {
        verify = checkRow(&data, parityChecks[i]);
        if(verify != 0) { // we do not have even parity
            return -1;
        }
    }
    return 1;
}