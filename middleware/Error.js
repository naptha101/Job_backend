// class ErrorHandle extends Error{
//     constructor(message,statusCode){
//         super(message);
//         this.statusCode=statusCode
//     }
// }
// export const errorMiddleware=(err,req,res,next)=>{
//     err.message=err.message||"Internal Error";
//     err.statusCode=err.statusCode||500;
//     if(err.name=="CaseError"){
//   const message=`Resource not found ${err.path}`
// err=new ErrorHandle(message,err.statusCode);
//     }
//     if(err.name=="CaseError"){
//         const message=`Resource not found ${err.path}`
//       err=new ErrorHandle(message,err.statusCode);
//           }
//     if(err.code==11000){
//             const message=`${err.key}`
//           err=new ErrorHandle(message,err.statusCode);
//               }

// }