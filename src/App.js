// App.js

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios';
import { Cookies } from 'react-cookie';

 
import { FaTrashAlt, FaWindowClose } from 'react-icons/fa';


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

      this.state = {
        txttodo: '',
        showResults: '',
        todolist: [],
        chkval : null,
        txtedit : '',
        login : '',
        username : '',
        password : '',
        api : 'http://127.0.0.1:8000/api/',
        token : '',
        header : '',
        userid : null,
        txtshareemailid : '',
        sharebool : false
        
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

    
    axios.post(this.state.api + 'email',{'userid' : this.state.userid, 'emailid' : this.state.txtshareemailid })
    .then(response => {
      
        if(response.data.status){
          this.setState({ sharebool : false , txtshareemailid : '' });
          alert(response.data.msg);
          // this.setState({  todolist: response.data.data  });
        }else {
          console.log(response.data.msg);
        }
    })
    .catch(function (error) {
      console.log(error);
    }) 
  }
  }

  handlechkChange(id,val,e){
      var obj ={}; 
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
            this.setState({  todolist: res.data.data })
          }else{
            console.log(res.data.msg);
          }
         }).catch(function (error) {
        console.log(error);
      }) 
  }

  close(e){
       
    this.setState({showResults : ''});
  }
    clkupdatetxt(id,e){
      e.preventDefault();
        
        if(this.state.txtedit){
          const obj = {
            id : id,
            name: this.state.txtedit,
            userid : this.state.userid
          }; 
          axios.post(this.state.api + 'edit', obj)
              .then(res => { 
                if(res.data.status){
                  this.setState({ todolist: res.data.data ,txtedit: '', showResults : ''  });
                }else {
                  console.log(res.data.msg);
                }
                      }).catch(function (error) {
                console.log(error);
              }) 
         }
    }
  
  getData(){
    const cookies = new Cookies();
    var token1 = cookies.get('token');
    var id = cookies.get('id');
    axios.defaults.headers.common['Authorization'] = "Bearer "+ token1;
      axios.post(this.state.api + 'list',{'userid' : id })
      .then(response => {
          if(response.data.status){
            this.setState({  todolist: response.data.data  });
          }else {
            console.log(response.data.msg);
          }
        
      })
      .catch(function (error) {
        console.log(error);
      }) 
  }

  loginsubmit(e){
    const cookies = new Cookies();
    e.preventDefault();
    if(this.state.username && this.state.password){
      const obj = {
        email: this.state.username,
        password: this.state.password
      }; 
      axios.post(this.state.api + 'login',obj)
          .then(res => {  if(res.data.success.token) {this.setState({ token : res.data.success.token, userid : res.data.id, header : {"authorization" : "Bearer "+ res.data.success.token} }); cookies.set('id',res.data.id); cookies.set('token',res.data.success.token); this.getData(); } else { console.log('error found'); }  }).catch(function (error) {
            console.log(error);
            alert('Username and password not match');
          }) 
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
        this.setState({ token : '' });
      }
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
         <button className="btn btn-primary btn-sm mt-2" onClick={this.logout} >Logout</button>
         <button className="btn btn-primary btn-sm ml-2 mt-2" onClick={this.opentxtbox} >Share</button>
       <form className={this.state.sharebool ? 'showbox': 'hidebox' } onSubmit={this.submitemilid}>
         <input placeholder="Enter Email id"
                               type="text" 
                               className="form-control col-4 mt-2" 
                               value={this.state.txtshareemailid}
                               onChange={this.onChangeshareemailid}
                               />
                               </form>
         <h3 className="text-center mt-3">TO-DO Application</h3>
        
         <div className="row">
           <div className="col-12">
           <form onSubmit={this.onSubmit} className="form-inline"> 
         <div className="form-group col-12">
           <input placeholder="Create To-DO"
                               type="text" 
                               className="form-control col-12" 
                               value={this.state.txttodo}
                               onChange={this.onChangetodoname}
                               />
         </div>
           </form>
           </div>
         </div>
      
     <table className="table table-striped mt-2" style={{ marginTop: 20 }}>
        <tbody>
          <tr className={this.state.todolist.length === 0 ? 'showbox' : 'hidebox'}>
          <td ><h2>No Data Found</h2></td>
          </tr>
       {this.state.todolist.map(data => (
           <tr id={data.id}  key={data.id}>
               
             <td > 
             <div className={this.state.showResults === data.id ? 'showbox' : 'hidebox'}>
               <form onSubmit={this.clkupdatetxt.bind(this,data.id)} > 
             <input ref={input => input && input.focus()} className='form-control col-6' type='text' value={this.state.txtedit} onChange={this.onEditChangetodoname} /> 
             </form>
             <button onClick={this.close}><FaWindowClose /></button>
             </div>
             <div className={this.state.showResults !== data.id ? 'showbox' : 'hidebox'}>
             <div className="form-check sameline">
             <input className="form-check-input position-static" type="checkbox" onClick={this.handlechkChange.bind(this,data.id,data.donelist)}  defaultChecked={data.donelist}  />
             </div>
             <p id={data.id} className='alert alert-info sameline' onClick={this.donework.bind(this,data.id,data.name)}> {data.donelist ? <del>{data.name}</del> : `${data.name}` }</p>
             <button value={data.id} onClick={this.delete} className="btn btn-danger btn-sm ml-2"> <FaTrashAlt /></button>
             </div>
             </td>
             
            </tr>
         ))} 
       </tbody>
     </table> 
      </div>
  )
  }

  donework(id,name,event){
    this.setState({txtedit : name});
    this.setState({ showResults: id });
    
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
  delete(event){
    
  axios.get(this.state.api +'delete/'+ event.currentTarget.value +'/'+this.state.userid)
  .then(res=> { if(res.data.status){ this.setState({ todolist: res.data.data });  } else { console.log(res.data.msg);  }  })
  .catch(err => console.log(err))
 }

  onSubmit(e) {
    e.preventDefault();
    
      if(this.state.txttodo){
        
        const obj = {
          txttodo: this.state.txttodo,
          userid : this.state.userid
        }; 
        axios.post(this.state.api + 'add', obj)
            .then(res => { if(res.status) { this.setState({ todolist: res.data.data });   } else { console.log(res.data.msg); }  })
            .catch(function (error) {
              console.log(error);
            }) 

             this.setState({
              txttodo: ''
            })
      }
  }


  render() {
   if(this.state.token){
        return  this.todoForm();
    }else {
      return this.loginForm();
    } 
  }
}