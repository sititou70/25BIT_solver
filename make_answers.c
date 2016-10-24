#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>

typedef __int32 board;

typedef struct {
	board q;
	board a;
	__int8 trouble;
} qanda;

__int32 array_length = 33554432;
__int32 i;
__int32 j;
__int8 trouble;
board question;
board one_bits[25];
board toggle_bits[25];
board no_answer = 0;;
clock_t start_clock, end_clock, sum_clock;

void printBoard(board bits){
	__int32 i;
	for (i = 0; i < 25; i++) {
		if(bits & one_bits[i]){
			printf("1");
		}else{
			printf("0");
		}
		if(i % 5 == 4)printf("\n");
	}
};

int comp_by_question(const void * a, const void * b) {
	if((*(qanda*)a).q < (*(qanda*)b).q) {
		return -1;
	}else if((*(qanda*)a).q > (*(qanda*)b).q){
		return 1;
	}else if((*(qanda*)a).trouble < (*(qanda*)b).trouble){
		return -1;
	}else if((*(qanda*)a).trouble > (*(qanda*)b).trouble){
		return 1;
	}
	return 0;
}

int main(){
	if(remove("answers.dat") == 0)printf("deleted old answers.dat file.\n");
	qanda* array = calloc(sizeof(qanda), array_length);
	
	printf("calculating one_bits and toggle_bits...");
	start_clock = clock();
	
	for(i = 0; i < 25; i++){
		one_bits[i] = pow(2, i);
	}
	
	for (i = 0; i < 25; i++) {
		toggle_bits[i] = 0;
		toggle_bits[i] |= one_bits[i];
		if(i >= 5)toggle_bits[i] |= one_bits[i - 5];
		if(i % 5 <= 3)toggle_bits[i] |= one_bits[i + 1];
		if(i <= 19)toggle_bits[i] |= one_bits[i + 5];
		if(i % 5 >= 1)toggle_bits[i] |= one_bits[i - 1];
	}
	end_clock = clock();
	printf("OK(%.3fsec)\n", (double)(end_clock - start_clock)/CLOCKS_PER_SEC);
	
	sum_clock += end_clock - start_clock;
	
	printf("calculating answer from question...");
	start_clock = clock();
	for(i = 0; i < array_length; i++){
		question = 0;
		trouble = 0;
		
		for(j = 0; j < 25; j++){
			if(i & one_bits[j]){
				question ^= toggle_bits[j];
				trouble++;
			}
		}
		
		array[i].q = question;
		array[i].a = i;
		array[i].trouble = trouble;
	}
	end_clock = clock();
	printf("OK(%.3fsec)\n", (double)(end_clock - start_clock)/CLOCKS_PER_SEC);
	
	sum_clock += end_clock - start_clock;
	
	printf("sorting answer order by question...");
	start_clock = clock();
	qsort((void *)array, array_length, sizeof(qanda), comp_by_question);
	end_clock = clock();
	printf("OK(%.3fsec)\n", (double)(end_clock - start_clock)/CLOCKS_PER_SEC);
	
	sum_clock += end_clock - start_clock;
	
	printf("writing answer to answers.dat...");
	start_clock = clock();
	FILE* fp = fopen("answers.dat", "ab");
	for(i = 0, j = 0; i < array_length; i++){
		for(; array[j].q < i && j < array_length; j++){}
		
		if(array[j].q == i){
			fwrite(&array[j].a, sizeof(board), 1, fp);
		}else{
			fwrite(&no_answer, sizeof(board), 1, fp);
		}
	}
	end_clock = clock();
	printf("OK(%.3fsec)\n", (double)(end_clock - start_clock)/CLOCKS_PER_SEC);
	
	sum_clock += end_clock - start_clock;
	
	printf("done!(%.3fsec)\n", (double)(sum_clock)/CLOCKS_PER_SEC);
	
	return 0;
}
