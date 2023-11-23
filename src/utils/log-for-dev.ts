const logForDev = <A>(log: A, dirname?: string): void => {
  console.log("Dados do tipo ---> ", typeof log);
  console.log(log);
  console.log("Localização --->", dirname);
};

export default logForDev;
