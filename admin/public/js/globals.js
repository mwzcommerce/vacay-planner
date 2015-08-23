/* Data table initialization */
var obj = {};
var editor;
$(document).ready(function(){
	obj.init();
});
obj = {
	init : function(){
        $('#imageUrl').on('change',function(e){
            for (var i = 0; i < e.originalEvent.srcElement.files.length; i++) {
                var file = e.originalEvent.srcElement.files[i];

                var img = document.createElement("img");
                var filename = $(this).val().split('\\').pop();
                var reader = new FileReader();
                reader.onloadend = function() {
                    img.src = reader.result;

                }
                reader.readAsDataURL(file);
                $(".image-preview").empty().html(img).fadeIn();
            }
        });
        $('.tariff-tax-details .delete-edit-container,.facilities-list .delete-edit-container').on('click','.edit',function(e){
            e.preventDefault();
            var formId = '#'+$(this).attr('href');
            $(formId).find('.form-cont').slideToggle(500);
        });
        $('input[name="displayedCost"]').on('keyup',function(){
            var percentageVal = $('.percentageVal').val().split(",");
            var totalVal = 0;
            var $this = $(this);
            console.log("keyVal:"+$this.val());
            percentageVal.forEach(function(key){
                console.log("keyVal:"+$this.val());
                totalVal = totalVal+((parseInt($this.val())*parseInt(key))/100);
            });

            $('.totalCost').text(parseInt($this.val())+totalVal);
            if($(this).val() == "") $('.totalCost').text("00");
        });
        $("#categories").change(function(){
            var element = $("option:selected", this);
            var myTag = element.attr("cat-id");
            var options = "";
            $.ajax({
                url:"/categories/category/"+myTag+"?type=json",
                method:"GET",
                success:function(data){
                    data.category.classification.forEach(function(item){
                        options = options+"<option value='"+item.name+"'>"+item.name+"</option>";
                    });
                    if(options != ""){
                        $('.classifications').html(options);
                    }
                }

            });
        });
        $('form').validate({});
        var pageParams = location.href.split("/");
        var pageName = pageParams[pageParams.length-2];
        var tLength = $('.vacay-table').length;
        for(i=0;i<tLength;i++){
            $('.vacay-table').eq(i).find('td').length > 0 ?  $('.vacay-table').eq(i).show() : $('.vacay-table').eq(i).hide();
        }
        if(pageName == "categoryView"){
            var categoryName = $("#categoryName").val();
            $('.category-list .list-item').find('a.item-default[title="'+categoryName+'"]').parent('.list-item').addClass('active');
            var wtCount = $('.category-list .list-item').length * 102;
            $('.category-list').css('width',wtCount).fadeIn();

            obj.showResults(categoryName);
        }
        $('.cat-list .delete').on('click',function(e){
            e.preventDefault();
            var $ths = $(this);
            var del_id = $ths.parents('.delete-edit-container').find('#category_id').val();
            var imgUrl = $ths.attr('imageUrl');
            if(confirm("Do you want to delete the record")){
                $.ajax({
                    url:"/categories/category/"+del_id+"/"+imgUrl,
                    method:"DELETE",
                    success:function(data){
                        $ths.parents('tr').fadeOut(500,function(){
                            $ths.parents('tr').remove();
                        });
                    }
                });
            }
        });
        $('.class-list .delete').on('click',function(e){
            e.preventDefault();
            var $ths = $(this);
            var del_id = $ths.parents('.delete-edit-container').find('#classification_id').val();

            if(confirm("Do you want to delete the record")){
                $.ajax({
                    url:"/classifications/classification/"+del_id,
                    method:"DELETE",
                    success:function(data){
                        $ths.parents('tr').fadeOut(500,function(){
                            $ths.parents('tr').remove();
                        });
                    }
                });
            }
        });
        $('.add-category,.add-calssification,.add-facilitygroup').on('click',function(e){
            e.preventDefault();
            $('.cat-list,.class-list').fadeOut(500,function(){
                obj.resetFields();
                $('.add-form-container').fadeIn(500);
            });
        });
        $('.cancel-category-addition,.cancel-classification-addition').on('click',function(){
            $('.add-form-container').fadeOut(500,function(){
                $('.cat-list,.class-list').fadeIn(500);
            });
        });

        //Add category service request
        $('#add-new-category').on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            if($(this).parents('form').valid()){
                $(this).parents('form').submit();
            }
            /*var formData = $('#add-category-form').serialize();
            $.ajax({
                url:"/categories/category/",
                data:formData,
                method:"PUT",
                success:function(){
                    location.href="/categories/list";
                    console.log("Added");
                }
            });*/
        });
				$('.add-tax-details,.add-facility-details').on('click',function(e){
					e.preventDefault();
					$(this).parents('.vacay-section').find('.add-form-inline .form-cont').slideDown();
				})
				$('.close-btn').on('click',function(e){
					e.preventDefault();
					$(this).parent('.form-cont').slideUp();
				});
				$('#add-tariff-tax').on('click',function(e){
					e.preventDefault();
					e.stopPropagation();
					if($(this).parents('form').valid()){
						var formData = $('#tax-form').serialize();
						var formDataArray = JSON.parse(JSON.stringify($('#tax-form').serializeArray()));
						var productId = $("#productID").val();
						var tariff_id = $("#tariff-id").val();
						var URL = '/products/'+productId+'/'+tariff_id+'/taxdetails';
						console.log(formData);
						obj.sendAjax(URL,"POST",formData,function(){
							window.location.href = "/products/"+productId+"/tariff/"+tariff_id+"/tariff-view";
						});
						// obj.sendAjax(URL,"POST",formData,function(){
						// 	var trData = "";
						// 	formDataArray.forEach(function(key){
						// 		if(key.name = "percentage"){
						// 			trData = trData+"<td>INR. "+key.value+"</td>";
						// 		}
						// 		else if(key.name == "amount"){
						// 			trData = trData+"<td>INR. "+key.value+"</td>";
						// 		}
						// 		else{
						// 			trData = trData+"<td>"+key.value+"</td>";
						// 		}
						// 	});
						// 	$('.vacay-table.tariff-tax-details tr').eq(0).after("<tr>"+trData+"<td><div class='delete-edit-container'><a href='#' class='edit' title='Edit the row'>Edit</a> /<a href='' class='delete' title='Delete the row'>Delete</a><div><td></tr>");
						// });
					}
				})
                $('#update-tariff-tax').on('click',function(e){
                    e.preventDefault();
					e.stopPropagation();
                    if($(this).parents('form').valid()){
                        var formData = $(this).parents('form').serialize();
                        var productId = $(this).parents('form').find('#productID').val();
                        var tariffId = $(this).parents('form').find('#tariff-id').val();
                        var taxId = $(this).parents('form').find('#tax-id').val();
                        var URL = "/products/"+productId+"/updateTaxTariff/"+tariffId+"/"+taxId;
                        obj.sendAjax(URL,"POST",formData,function(data){
                            console.log(data);
                            location.href = location.href;
                        });
                    }
                });
				$('#add-gender-rules').on('click',function(e){
					e.preventDefault();
					e.stopPropagation();
					if($(this).parents('form').valid()){
						var formData = $('#gender-form').serialize();
						var formDataArray = JSON.parse(JSON.stringify($('#gender-form').serializeArray()));
						var productId = $("#productID").val();
						var tariff_id = $("#tariff-id").val();
						var URL = '/products/'+productId+'/'+tariff_id+'/genderPriceRules';
						console.log(formData);
						obj.sendAjax(URL,"POST",formData,function(){
							window.location.href = "/products/"+productId+"/tariff/"+tariff_id+"/tariff-view";
						});
					}
				});

				$('#add-priceOverride-rules').on('click',function(e){
					e.preventDefault();
					e.stopPropagation();
					if($(this).parents('form').valid()){
						var formData = $('#priceOverride-form').serialize();
						var formDataArray = JSON.parse(JSON.stringify($('#priceOverride-form').serializeArray()));
						var productId = $("#productID").val();
						var tariff_id = $("#tariff-id").val();
						var URL = '/products/'+productId+'/'+tariff_id+'/priceRules';
						console.log(formData);
						obj.sendAjax(URL,"POST",formData,function(){
							window.location.href = "/products/"+productId+"/tariff/"+tariff_id+"/tariff-view";
						});
					}
				})

        $('#add-new-classification').on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            if($(this).parents('form').valid()){
                var formData = $('#add-classification-form').serialize();
                $.ajax({
                    url:"/classifications/classification/",
                    data:formData,
                    method:"PUT",
                    success:function(data){
                        if(data.msg == "success"){
                            console.log(data.msg);
                            location.href="/classifications/all";
                        }
                        else{
                            $('.msg').text(data.msg);
                            $('.msg').parents('.form-group').removeClass('hidden');
                            setTimeout(function(){$('.msg').parents('.form-group').addClass('hidden');},5000);
                        }
                    }
                });
            }

        });
        $('#edit-category').on('click',function(e){
            var formData = $('#edit-category-form').serialize();
            var recordId = $('#edit-category-form').find('input[name="id"]').val();
            console.log(recordId);
            e.preventDefault();
            e.stopPropagation();
            if($(this).parents('form').valid()){
                $(this).parents('form').submit();
            }
            /*$.ajax({
                url:"/categories/category/"+recordId,
                data:formData,
                method:"POST",
                success:function(){
                    location.href="/categories/list";
                    console.log("Updated");
                }
            });*/
        });
        $('#add-category-classification').on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            if($(this).parents('form').valid()){
                $(this).parents('form').submit();
            }
        });
        $('#edit-classification').on('click',function(e){
            var formData = $('#edit-classification-form').serialize();
            var recordId = $('#edit-classification-form').find('input[name="id"]').val();
            console.log(recordId);
            e.preventDefault();
            e.stopPropagation();
            /*if($(this).parents('form').valid()){
                $(this).parents('form').submit();
            }*/
            $.ajax({
                url:"/classifications/classification/"+recordId,
                data:formData,
                method:"POST",
                success:function(){
                    location.href="/classifications/all";
                    console.log("Updated");
                }
            });
        });

        /* Product related actions */

        /*Add Product*/
        $('#add-product').on('click',function(e){
            e.preventDefault();
            if($(this).parents('form').valid()){
                var URL = "/products/product/";
                var category = $('select[name="category"').val();
                var formData = $('#add-product-form').serialize();
                console.log(formData);
                obj.sendAjax(URL,"PUT",formData,obj.redtSuccess('/categories/categoryView/'+category));
            }

        });


        /*Edit Product*/
        $('#edit-product').on('click',function(e){
            e.preventDefault();
            if($(this).parents('form').valid()){
                var productId = $('#edit-product-form').find('input[name="id"]').val();
                var URL = "/products/product/"+productId;
                var formData = $('#edit-product-form').serialize();
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            }

        });
        /*Delete Product*/
        $('.search-result-table').on('click','.delete',function(e){
            e.preventDefault();
            var URL = $(this).attr('href');
            var $ths = $(this);
            if(confirm("Do you want to delete the record")){
                obj.sendAjax(URL,'DELETE','',obj.deleteSuccess($ths,'tr'));
            }
        });

        /* Create New image */
        $('#add-image').on('click',function(){
            if ($('#add-image-form').valid()) {
                $(this).parents('form').submit();
                /*var formData = $('#add-address-form').serialize();
                var productId = $('#add-address-form').find('input[name="id"]').val();
                var URL = "/products/"+productId+"/address";
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));*/
            } else {
            }

        });

        /*Update Address /:productId/address/:addressId*/
        $('#update-image').on('click',function(e){
            e.preventDefault();
            if($(this).parents('form').valid()){
                $(this).parents('form').submit();
                /*var formData = $('#update-address-form').serialize();
                var productId = $('#update-address-form').find('input[name="id"]').val();
                var addressId = $('#update-address-form').find('input[name="addressId"]').val();
                var URL = "/products/"+productId+"/address/"+addressId;
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));*/
            }
        });

        /* Create New address */
        $('#add-address').on('click',function(){
            if ($('#add-address-form').valid()) {
                var formData = $('#add-address-form').serialize();
                var productId = $('#add-address-form').find('input[name="id"]').val();
                var URL = "/products/"+productId+"/address";
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            } else {
            }

        });
        $('select[name="classification"]').on('change',function(){
            $(this).parents('form').find('.error.msg').parent('.form-group').addClass('hide');
        });
        $('#add-product-classification').on('click',function(){
            if ($('#add-product-classification-form').valid()) {
                var formData = $('#add-product-classification-form').serialize();
                var productId = $('#add-product-classification-form').find('input[name="id"]').val();
                var URL = "/products/"+productId+"/classification";
                obj.sendAjax(URL,"POST",formData,
                    function(data){
                        if(data.msg !== undefined){
                            $(".error.msg").text(data.msg).parents(".form-group").removeClass("hide").show();
                        } else{
                            obj.newaddressSuccess(productId);
                        }

                    }
                );
            } else {
            }

        });


        /*Update Address /:productId/address/:addressId*/
        $('#update-address').on('click',function(e){
            e.preventDefault();
            if($(this).parents('form').valid()){
                var formData = $('#update-address-form').serialize();
                var productId = $('#update-address-form').find('input[name="id"]').val();
                var addressId = $('#update-address-form').find('input[name="addressId"]').val();
                var URL = "/products/"+productId+"/address/"+addressId;
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            }
        });

        /*Delete address*/
        $('.vacay-table .delete-edit-container').on('click','.delete',function(e){
            e.preventDefault();
            var URL = "/products"+$(this).attr('href');
            var $ths = $(this);
            if(confirm("Do you want to delete the record")){
                obj.sendAjax(URL,'DELETE','',obj.deleteSuccess($ths,'tr'));
            }
        });
        $('.vacaytable .delete-edit-container').on('click','.delete',function(e){
            e.preventDefault();
            var URL = $(this).attr('href');
            var $ths = $(this);
            if(confirm("Do you want to delete the record")){
                obj.sendAjax(URL,'DELETE','',obj.deleteSuccess($ths,'tr'));
            }
        });
        /*Add tariff*/
        $('#add-tariff').on('click',function(){
            if($(this).parents('form').valid()){
                var formData = $('#add-tariff-form').serialize();
                var productId = $('#add-tariff-form').find('input[name="id"]').val();
                var URL = "/products/"+productId+"/tariff";
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            }
        });

        /*Update tariff /:productId/address/:addressId*/
        $('#update-tariff').on('click',function(e){
            e.preventDefault();
            if($(this).parents('form').valid()){
                var formData = $('#update-tariff-form').serialize();
                var productId = $('#update-tariff-form').find('input[name="id"]').val();
                var tariffId = $('#update-tariff-form').find('input[name="tariffId"]').val();
                var URL = "/products/"+productId+"/tariff/"+tariffId;
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            }
        });

        /*Add amenity*/
        $('#add-amenity').on('click',function(){
            if($(this).parents('form').valid()){
                var formData = $('#add-amenity-form').serialize();
                var productId = $('#add-amenity-form').find('input[name="id"]').val();
                var URL = "/products/"+productId+"/amenity";
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            }
        });

        /*Update amenity /:productId/address/:addressId*/
        $('#update-amenity').on('click',function(e){
            e.preventDefault();
            if($(this).parents('form').valid()){
                var formData = $('#update-amenity-form').serialize();
                var productId = $('#update-amenity-form').find('input[name="id"]').val();
                var amenityId = $('#update-amenity-form').find('input[name="amenityId"]').val();
                var URL = "/products/"+productId+"/amenity/"+amenityId;
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            }
        });


        /*Add termsAndConditions*/
        $('#add-termsAndConditions').on('click',function(){
            if($(this).parents('form').valid()){
                var formData = $('#add-termsAndConditions-form').serialize();
                var productId = $('#add-termsAndConditions-form').find('input[name="id"]').val();
                var URL = "/products/"+productId+"/termsconditions";
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            }
        });

        /*Update termsAndConditions /:productId/address/:addressId*/
        $('#update-termsAndConditions').on('click',function(e){
            e.preventDefault();
            if($(this).parents('form').valid()){
                var formData = $('#update-termsAndConditions-form').serialize();
                var productId = $('#update-termsAndConditions-form').find('input[name="id"]').val();
                var amenityId = $('#update-termsAndConditions-form').find('input[name="termsAndConditionsId"]').val();
                var URL = "/products/"+productId+"/termsAndCondition/"+amenityId;
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            }
        });

        /*Add Phone Number*/
        $('#add-phoneNumber').on('click',function(){
            if($(this).parents('form').valid()){
                var formData = $('#add-phoneNumber-form').serialize();
                var productId = $('#add-phoneNumber-form').find('input[name="id"]').val();
                var URL = "/products/"+productId+"/phone";
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            }
        });

				/*Add Facility*/
        $('#add-facility').on('click',function(){
            if($(this).parents('form').valid()){
                var formData = $('#add-facility-form').serialize();
								console.log(formData);
                var productId = $('#add-facility-form').find('input[name="id"]').val();
                var URL = "/products/"+productId+"/facility";
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            }
        });
        
        
        /*Update phone /:productId/address/:addressId*/
        $('#update-phone').on('click',function(e){
            e.preventDefault();
            if($(this).parents('form').valid()){
                var formData = $('#update-phone-form').serialize();
                var productId = $('#update-phone-form').find('input[name="id"]').val();
                var phoneId = $('#update-phone-form').find('input[name="phoneId"]').val();
                var URL = "/products/"+productId+"/phoneNumber/"+phoneId;
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            }
        });

				/*Update facility */
        $('#update-facility').on('click',function(e){
            e.preventDefault();
            if($(this).parents('form').valid()){
                var formData = $('#update-facility-form').serialize();
                var productId = $('#update-facility-form').find('input[name="id"]').val();
                var facilityId = $('#update-facility-form').find('input[name="facilityId"]').val();
                var URL = "/products/"+productId+"/facility/"+facilityId;
								console.log("serealizeData"+formData+",URL:"+URL)
                obj.sendAjax(URL,"POST",formData,obj.newaddressSuccess(productId));
            }
        });

		//$('.category-list .list-item a').unbind('click',obj.showResultsOnClick).bind('click',obj.showResultsOnClick);
		$('#search-result').unbind('click',obj.showResults).bind('click',obj.showResults);
		$('.action-container').on('click','.add-row',function(e){
            e.preventDefault();
			$('.search-result-table,.search-form').fadeOut(500,function(){
                obj.resetFields();
				$('.add-form-container').show();
                $('.category-list.min-list').fadeOut();
			});

		});
        $('.cancel-add-category').on('click',function(e){
            e.preventDefault();
            $('.add-form-container').fadeOut(500,function(){
				$('.search-result-table').show();
                $('.category-list.min-list').fadeIn();
			});
        });
        $('#add-facility-group').on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            if($(this).parents('form').valid()){
                var formData = $('#add-facility-group-form').serialize();
                $.ajax({
                    url:"/facilities/facilitygroup/",
                    data:formData,
                    method:"PUT",
                    success:function(data){
                        console.log(data);
                        if(data.msg == "success"){
                            console.log(data.msg);
                            location.href="/facilities/all";
                        }
                        else{
                            $('.msg').text(data.msg);
                            $('.msg').parents('.form-group').removeClass('hidden');
                            setTimeout(function(){$('.msg').parents('.form-group').addClass('hidden');},5000);
                        }
                    }
                });
            }

        });
        
        $('#edit-facility').on('click',function(e){
            var formData = $('#edit-facility-group-form').serialize();
            var recordId = $('#edit-facility-group-form').find('input[name="id"]').val();
            console.log(recordId);
            e.preventDefault();
            e.stopPropagation();
            $.ajax({
                url:"/facilities/facility/"+recordId,
                data:formData,
                method:"POST",
                success:function(){
                    location.href="/facilities/all";
                    console.log("Updated");
                }
            });
        });
        
        $('#addFacility').on('click',function(e){
            var formData = $('#facility-form').serialize();
            var facilityGroupId = $('#facility-form').find('input[name="id"]').val();
            e.preventDefault();
            $.ajax({
                url:"/facilities/addFacility/"+facilityGroupId,
                data:formData,
                method:"PUT",
                success:function(data){
                    location.href = "/facilities/facilityView/"+facilityGroupId;
                }
            
            });
        });
        
        $('.editFacility').on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            var formData = $(this).parents('form').serialize();
            var facilityId = $(this).parents('form').find('input[name="id"]').val();
            var facilityGroupId = $(this).parents('form').find(".facilityId").val();
            console.log("facilityGroupId"+facilityGroupId);
            console.log("facilityId"+facilityId);
            
            $.ajax({
                url:"/facilities/editFacility/"+facilityId,
                data:formData,
                method:"POST",
                success : function(data){
                    window.location.href = "/facilities/facilityView/"+facilityGroupId;   
                }
            });
        });


	},
    confirm:function(msg){
        var result="false";
        $('.confirm-alert-container .alertMesg').text(msg);
        $('.confirm-alert-container').show();
        $('.confirm-alert-container .confirm-delete').on('click',function(){
            $('.confirm-alert-container').hide();
            result = "true";
        });
        $('.confirm-alert-container .confirm-cancel').on('click',function(){
            result = "false";
        });
        return result;
    },
    resetFields:function(){
        $('input[type="textbox"],input[type="file"],input[type="email"]').val('');
        $('select option:selected').removeAttr("selected");
        $('.image-preview').hide().html("");
    },
    redtSuccess:function(page){
        location.href=page;
    },
    deleteSuccess:function($ths,container){
        $ths.parents(container).fadeOut(500,function(){
            var categoryName =$('#categoryName').val();
            obj.buildDataTable(categoryName);
        });
    },
    newaddressSuccess:function(id){
        location.href="/products/product/"+id;
    },
    sendAjax:function(URL,req,formData,sAction){
        $.ajax({
            url:URL,
            data:formData,
            method:req,
            success:sAction
        });
    },
	hideAll:function(){
		setTimeout(function(){$('.search-result-table').hide();},1500);
	},
	initDataTable : function(tableObject,listObj,categoryName){
		var table=tableObject.dataTable( {
             "processing": true,
			"ajax": "/products/category/"+categoryName,
			"columns": listObj,
            "destroy": true,
            "pageLength": 10,
            bFilter: false,
            bInfo: false,
            "ordering":false,
            "bLengthChange": false,
            "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                $(nRow).attr('id', aData['_id']);
                $(nRow).find('.delete-edit-container a').attr('href','/products/product/'+aData['_id']);
            }
		});
        $('.search-result-table').fadeIn(1000,function(){
            $('.category-list').addClass('min-list');
        });

	},
	switchCategory:function(e){
		e.preventDefault();
		$('.category-list').addClass('min-list');
        //$('.search-form').fadeIn();
	},
	showResults:function(categoryName){
		obj.buildDataTable(categoryName);
	},
    showResultsOnClick:function(e){
		e.preventDefault();
        var categoryName = $(this).attr('title');
        $('#categoryName').val(categoryName);
		obj.buildDataTable(categoryName);
	},
    buildDataTable:function(categoryName){
        var tObj = $('#result-table');
		var arr = [{ "data": "name" },
                   {"data":"description"},
                   {"data":"emailAddress"},
                    {
                        data: null,
                        className: "center",
                        defaultContent: '<div class="delete-edit-container"><a href="#" class="edit" title="Edit the row">Edit</a> / <a href="#" class="delete" title="Delete the row">Delete</a></div>'
                    }
                  ];

		$('.add-form-container').hide();
        obj.initDataTable(tObj,arr,categoryName);
    }
}
