import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddProductSchema = Yup.object().shape({
  title: Yup.string().required("Vă rugăm să introduceți un titlu pentru produs."),
  // desc: Yup.string().required("Vă rugăm să adăugați o descriere detaliată a produsului."),
  price: Yup.number().min(0.01, "Vă rugăm să specificați un preț corect.").required("Prețul este obligatoriu."),
  stock: Yup.number().required("Vă rugăm să indicați cantitatea disponibilă în stoc."),
  images: Yup.array().of(Yup.string().url("Vă rugăm să furnizați un URL valid pentru imagine.")).required("Este necesară cel puțin o imagine.")
});

const AddProduct = () => {
  const [imageUrls, setImageUrls] = useState([]);

  const addProduct = async values => {
    const toSend = { ...values, images: imageUrls }
    try {
      const response = await fetch("http://localhost:8080/product/", {
        method: "POST",
        headers: {
          token: localStorage.getItem('token'),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toSend),
        user: localStorage.getItem('user')
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      alert("Produs adăugat!");
      console.log("Added: ", data);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }

  const handleSubmit = async (values, { resetForm }) => {
    await addProduct(values);
    resetForm({ values: { title: "", price: "", stock: "", images: [] } });
    setImageUrls([]);  // Resetăm lista de imagini
  };

  const handleImageUrlChange = (e, index) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = e.target.value;
    setImageUrls(newImageUrls);
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrlField = (index) => {
    const newImageUrls = imageUrls.filter((url, i) => i !== index);
    setImageUrls(newImageUrls);
  };

  return (
    <div className="container mt-5 p-5 card shadow-lg bg-light" style={{ width: "35vw" }}>
      <Formik
        initialValues={{
          title: "",

          price: "", stock: "",
          images: []
        }}
        validationSchema={AddProductSchema}
        onSubmit={handleSubmit}
      >
        {({ }) => (
          <Form>
            <div className="form-group ">
              <label htmlFor="title">Titlu produs nou</label>
              <Field type="text" name="title" className="form-control" />
              <ErrorMessage name="title" component="div" className="text-danger" />
            </div>
            <div className="form-group ">
              <label htmlFor="price">Preț produs</label>
              <Field type="number" step="0.01" name="price" className="form-control" />
              <ErrorMessage name="price" component="div" className="text-danger" />
            </div>

            {/* <div className="form-group ">
              <label htmlFor="desc">Descrierea produsului</label>
              <Field as="textarea" name="desc" className="form-control" />
              <ErrorMessage name="desc" component="div" className="text-danger" />
            </div> */}

            <div className="form-group ">
              <label htmlFor="stock">Stoc</label>
              <Field type="number" name="stock" className="form-control" />
              <ErrorMessage name="stock" component="div" className="text-danger" />
            </div>

            <div className="row mt-3">
              <div className="form-group col-md-12">
                <label>Imagini</label>


                {imageUrls.map((url, index) => (
                  <div key={index} className="d-flex mb-2">
                    <Field
                      type="text"
                      name={`images[${index}]`}
                      className="form-control"
                      value={url}
                      onChange={(e) => handleImageUrlChange(e, index)}
                      placeholder="URL imagine"
                    />
                    <button
                      type="button"
                      className="btn btn-danger ml-2"
                      onClick={() => removeImageUrlField(index)}
                    >
                      Șterge
                    </button>
                  </div>
                ))}


                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addImageUrlField}
                  >
                    Adaugă imagine
                  </button>
                </div>

                {/* Mesajul de eroare pentru imagini */}
                <ErrorMessage name="images" component="div" className="text-danger" />
              </div>
            </div>

            <button type="submit" style={{ backgroundColor: 'darkred', width: '100%', color: 'white' }} className="btn btn-primary my-3">Adaugă produs</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProduct;
