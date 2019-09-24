// App.js

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/BeatLoader';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { FaTimes, FaCheck } from 'react-icons/fa';

const override = css`
    display: block;
    margin : 0 auto;
    margin-top : 10px;
    border-color: red;
    width:200px;
    height:50px;
`;

export default class Create extends Component {
  constructor(props) {
      super(props);
      this.onChangetodoname = this.onChangetodoname.bind(this);
      this.onEditChangetodoname = this.onEditChangetodoname.bind(this);
      this.onChangeshareemailid = this.onChangeshareemailid.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.clkupdatetxt = this.clkupdatetxt.bind(this);
      this.handlechkChange = this.handlechkChange.bind(this);
      this.close = this.close.bind(this);
      this.loginForm = this.loginForm.bind(this);
      this.onChangeusername = this.onChangeusername.bind(this);
      this.onChangepassword = this.onChangepassword.bind(this);
      this.loginsubmit = this.loginsubmit.bind(this);
      this.delete = this.delete.bind(this);
      this.donework = this.donework.bind(this);
      this.todoForm = this.todoForm.bind(this);
      this.logout = this.logout.bind(this);
      this.submitemilid = this.submitemilid.bind(this);
      this.opentxtbox = this.opentxtbox.bind(this);
      this.cancelemail = this.cancelemail.bind(this);

      this.state = {
        txttodo: '',
        showResults: '',
        todolist: [],
        chkval : null,
        txtedit : '',
        login : '',
        username : '',
        password : '',
        api : 'https://bhayanisumit.in/zero-api/public/api/',
        token : '',
        header : '',
        userid : null,
        txtshareemailid : '',
        sharebool : false,
        loading: true
        
      }
  } 

  componentDidMount(){
    const cookies = new Cookies();
      var token1 = cookies.get('token');
      var id = cookies.get('id');
      if(token1){
        this.setState({ token : token1 , userid : id })
        this.getData();
      }else {
        this.setState({ token : '' , loading:false });
      }
  }
 


  logout(){
    const cookies = new Cookies();
      cookies.remove('token');
      cookies.remove('id');
      this.setState({ token : '' });
  }

  opentxtbox(){
    this.setState({ sharebool : true });
  }

  submitemilid(e){
    e.preventDefault(); 
    if(this.state.txtshareemailid){
      this.setState({ loading : true });
          axios.post(this.state.api + 'email',{'userid' : this.state.userid, 'emailid' : this.state.txtshareemailid })
          .then(response => {
              if(response.data.status){
                  this.setState({ sharebool : false , txtshareemailid : '' , loading : false });
                  alert(response.data.msg);
              }else {
                  this.setState({ loading : false });
                  console.log(response.data.msg);
              }
          }).catch(function (error) {
            console.log(error);
          }) 
    }
 }

  handlechkChange(id,val,e){
      var obj ={}; 
        this.setState({ loading:true });
      if(val === 1){
         obj = {
          id : id,
          donelist: 0,
          userid : this.state.userid
        }
      } else {
         obj = {
          id : id,
          donelist: 1,
          userid : this.state.userid
        } 
      }
     axios.post(this.state.api +'updatelist', obj)
      .then(res => { 
          if(res.data.status){
            this.setState({  todolist: res.data.data , loading:false })
          }else{
            this.setState({  loading:false });
            console.log(res.data.msg);
          }
         }).catch(function (error) {
        console.log(error);
      }) 
  }

  close(e){
     this.setState({showResults : ''});
  }
  cancelemail(){
    this.setState({ sharebool : false ,txtshareemailid : '' });
  }
    clkupdatetxt(id,e){
     
      e.preventDefault();
         if(this.state.txtedit){
          this.setState({ loading: true })
          const obj = {
            id : id,
            name: this.state.txtedit,
            userid : this.state.userid
          }; 
          axios.post(this.state.api + 'edit', obj)
              .then(res => { 
                if(res.data.status){
                  this.setState({ todolist: res.data.data ,txtedit: '', showResults : '' ,loading : false });
                }else {
                  console.log(res.data.msg);
                }
                      }).catch(function (error) {
                console.log(error);
              }) 
         }
    }
   // get all method
  getData(){
    const cookies = new Cookies();
    var token1 = cookies.get('token');
    var id = cookies.get('id');
    axios.defaults.headers.common['Authorization'] = "Bearer "+ token1;
      axios.post(this.state.api + 'list',{'userid' : id })
      .then(response => {
          if(response.data.status){
            this.setState({  todolist: response.data.data , loading :false });
          }else {
            this.setState({ loading :false });
            console.log(response.data.msg);
          }
       })
      .catch(function (error) {
        console.log(error);
      }) 
  }
 // login 
  loginsubmit(e){
    const cookies = new Cookies();
    e.preventDefault();
    if(this.state.username && this.state.password){
      var self = this;
      this.setState({ loading : true });
      const obj = {
        email: this.state.username,
        password: this.state.password
      }; 
      axios.post(this.state.api + 'login',obj)
          .then(res => {  if(res.data.success.token) {this.setState({ token : res.data.success.token, userid : res.data.id, header : {"authorization" : "Bearer "+ res.data.success.token} }); cookies.set('id',res.data.id); cookies.set('token',res.data.success.token); this.getData(); } else { console.log('error found'); }  })
          .catch(function (error) {
               self.setState({ loading : false });
               alert('Username and password not match');
          }) 
    }
  }

  delete(event){
      this.setState({ loading : true });
     axios.get(this.state.api +'delete/'+ event.currentTarget.value +'/'+this.state.userid)
    .then(res=> { if(res.data.status){ this.setState({ todolist: res.data.data , loading : false })  } else { this.setState({ loading : false }); console.log(res.data.msg);  }  })
    .catch(err => console.log(err))
   }
  
    onSubmit(e) {
      e.preventDefault();
         if(this.state.txttodo){
           this.setState({ loading : true })
          const obj = {
            txttodo: this.state.txttodo,
            userid : this.state.userid
          }; 
          axios.post(this.state.api + 'add', obj)
              .then(res => { if(res.status) { this.setState({ todolist: res.data.data , loading : false });   } else {  this.setState({ loading : false }); console.log(res.data.msg); }  })
              .catch(function (error) {
                console.log(error);
              }) 
  
               this.setState({
                txttodo: ''
              })
        }
    }
  donework(id,name,status,event){
    if(status === 0){
    this.setState({txtedit : name});
    this.setState({ showResults: id });
  }
    // this.setState({ activeIndex : 'input'+event.target.id });
  }
  onChangetodoname(e) {
    this.setState({
      txttodo: e.target.value
    });
  }
 onChangepassword(e){
   
  this.setState({
    password: e.target.value
  });
 }
 onChangeusername(e){
  
  this.setState({
    username: e.target.value
  });
 }

  onEditChangetodoname(e){
    this.setState({
      txtedit: e.target.value
    });
  }
  onChangeshareemailid(e){
    this.setState({
      txtshareemailid : e.target.value
    })
  }
 

  loginForm() {
    return (
      <div className="container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card card-signin my-5">
            <div className="card-body">
              <h5 className="card-title text-center">Sign In</h5>
              <form className="form-signin" onSubmit={this.loginsubmit} >
                <div className="form-label-group">
                  <input type="email" id="inputEmail" className="form-control" 
                     value={this.state.username}
                     onChange={this.onChangeusername}
                      placeholder="Email address"  />
                  
                </div>
            <div className="form-label-group mt-2">
                  <input type="password" id="inputPassword" 
                  className="form-control"
                  value={this.state.password}
                     onChange={this.onChangepassword}
                   placeholder="Password"  />
                  
                </div>
             <button className="btn btn-lg mt-2 mb-3 btn-primary btn-block text-uppercase" type="submit">Sign in</button>
             <p>Username : sumit@gmail.com / sumit1@gmail.com</p>
             <p>Password : 123456  </p>
             <ClipLoader
          css={override}
          sizeUnit={"px"}
          size={30}
          color={'#123abc'}
          loading={this.state.loading}
        />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

  todoForm(){
    return (
      <div className='container'>
         <div className='sweet-loading'>
        <ClipLoader
          css={override}
          sizeUnit={"px"}
          size={30}
          color={'#123abc'}
          loading={this.state.loading}
        />
      </div> 
         <button className="btn btn-primary btn-sm mt-2" onClick={this.logout} >Logout</button>
         <button className="btn btn-primary btn-sm ml-2 mt-2" onClick={this.opentxtbox} >Share</button>
       
       <div className={this.state.sharebool ? 'showbox': 'hidebox' } ><form onSubmit={this.submitemilid}>
         <input placeholder="Enter Email id"
                               type="text" 
                               className="form-control col-4 mt-2" 
                               value={this.state.txtshareemailid}
                               onChange={this.onChangeshareemailid}
                               />
                               </form>
                               <button className='mt-1 btn  btn-sm btn-primary' onClick={this.submitemilid}><FaCheck /></button>
                               <button className='mt-1 btn ml-1 btn-sm btn-info' onClick={this.cancelemail}><FaTimes /></button>
                               </div>
         <h3 className="text-center mt-3">To-Do Application</h3>
         
         <form onSubmit={this.onSubmit}>
         <div className=" form-row ">
    <div className="col-7  offset-md-2">
      <input type="text" className="form-control form-control-lg" placeholder="Create To-DO"    
                               value={this.state.txttodo}
                               onChange={this.onChangetodoname} />
    </div>
    <div className="col">
      <button className='form-contorl btn btn-lg btn-primary'><FaCheck /></button>
    </div>
  </div>
            </form> 
        
     <table className="table table-striped mt-4 col-8 table-dark" style={{ marginTop: 20 }}>
        <tbody>
          <tr className={this.state.todolist.length === 0 ? 'showbox' : 'hidebox'}>
          <td ><h2>No Data Found</h2></td>
          </tr>
       {this.state.todolist.map(data => (
           <tr id={data.id}  key={data.id}>
             <td> 
             <div className={this.state.showResults === data.id ? 'showbox' : 'hidebox'}>
               <form onSubmit={this.clkupdatetxt.bind(this,data.id)} > 
             <input ref={input => input && input.focus()} className='form-control col-8' type='text' value={this.state.txtedit} onChange={this.onEditChangetodoname} /> 
             
             </form>
             <button className='sameline mt-2  btn btn-primary btn-sm' onClick={this.clkupdatetxt.bind(this,data.id)}><FaCheck /></button>
             <button className='mt-2 sameline ml-1 btn btn-info btn-sm' onClick={this.close}><FaTimes /></button>
             
             </div>
             <div className={this.state.showResults !== data.id ? 'showbox' : 'hidebox'}>
             <div className="form-check sameline">
              <input className="form-check-input position-static" type="checkbox" onClick={this.handlechkChange.bind(this,data.id,data.donelist)}  defaultChecked={data.donelist}  />
             </div>
             <p id={data.id} className=' pl-4 h4 sameline' onClick={this.donework.bind(this,data.id,data.name,data.donelist)}> {data.donelist ? <del>{data.name}</del> : `${data.name}` } </p>
              <button value={data.id} onClick={this.delete} className="btn btn-info float-right   btn-sm ml-2"> <FaTimes /></button>
             </div>
             </td>
            </tr>
         ))} 
       </tbody>
     </table> 
      </div>
  )
  }

  render() {
   if(this.state.token){
        return  this.todoForm();
    }else {
      return this.loginForm();
    } 
  }
}