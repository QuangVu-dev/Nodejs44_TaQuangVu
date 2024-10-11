const createUser = (req, res) => {
   let params = req.params;
   let { id, hoTen } = params;
   let body = req.body;
   res.send({
      id,
      hoTen,
   });
};
export { createUser };
