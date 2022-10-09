package response

import (
	"encoding/json"
	"log"
	"net/http"
)

type Data = interface{}
type Pagination struct {
	Total  int `json:"total"`
	Offset int `json:"offset"`
	Limit  int `json:"limit"`
}

type DataPagination struct {
	Pagination Pagination `json:"pagination,omitempty"`
	Data       Data       `json:"data,omitempty"`
}

type Response struct {
	Ok       bool   `json:"ok"`
	Message  string `json:"message,omitempty"`
	Response Data   `json:"response,omitempty"`
}

func New(s bool, m string, d Data) Response {
	return Response{s, m, d}
}

func (r *Response) ToJson() []byte {
	j, err := json.Marshal(r)

	if err != nil {
		log.Fatal(err)
	}

	return j
}

func (r *Response) Done(response http.ResponseWriter, httpHeaderStatus int) error {
	response.WriteHeader(httpHeaderStatus)
	response.Write(r.ToJson())
	return nil
}

func ErrorHandler(h func(http.ResponseWriter, *http.Request) error) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := h(w, r)
		if err != nil {
			res := New(false, err.Error(), nil)
			res.Done(w, http.StatusInternalServerError)
		}
	}
}
