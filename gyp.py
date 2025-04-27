print("fdd");
age = int(input("Enter your age!"))


if age == 6:
    print(age)
elif age == 7:
    print(age)

count= int(3)

for i in range(5):
    
    print(count)
    if i==3:
        print("hello")
    elif i==4:
        print("World")
    else:
        print("Gottaa")         
    count+=1
 
while count>=0:
    if(count==4):
        print("I am 4")
    elif count==3:
        print("I am 3")
    
    count-=1

def mosta():
    print("Hello, I am mostafa")
    if count>=0: print("count value is"+count) 
mosta()