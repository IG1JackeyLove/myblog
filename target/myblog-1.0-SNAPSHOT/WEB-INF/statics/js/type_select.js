var categoryId;
var typeId;

//初始化一级分类
function init() {
    //清空当前数据
    layui.jquery("#category").empty();
    layui.jquery("#type").empty();
    categoryId=null;
    typeId=null;
    //请求数据
    layui.jquery.ajax({
        url: "/type?userId="+1,
        type: "get",
        dataType: "json",
        success: function (result) {
            typeData = result;
            //添加提示选项
            appendOption(layui.jquery('#typeForm').find('select[name=category]'),"一级分类","");
            appendOption(layui.jquery('#typeForm').find('select[name=type]'),"二级分类","");
            //遍历数据添加节点
            layui.jquery.each(typeData,function(){
                appendOption(layui.jquery('#typeForm').find('select[name=category]'),this.text,this.text);
            });
            layui.form.render();
        }
    });
}

//选项渲染
function appendOption($o,text,value){
    //新建一个option
    var $opt=layui.jquery("<option>").text(text).val(value);
    $opt.appendTo($o);
}

layui.use(['jquery', 'form'], function() {
    var $ = layui.jquery,
        form = layui.form,
        $form = $('#typeForm');

    //调用初始化函数
    init();

    //绑定选择事件
    form.on('select(category)', function(data) {
        categoryEvent(data);
    });
    form.on('select(type)', function(data) {
        typeEvent(data);
    });

    //监听一级分类选择事件
    function categoryEvent(data){
        //二级分类和typeID置空并添加提示选项
        $form.find('select[name=type]').html("");
        typeId=null;
        appendOption($form.find('select[name=type]'),"二级分类","");

        //当选择的不是提示选项时则遍历一级分类
        if(data.value!=""){
            $.each(typeData,function(index,category){
                //如果是当前选择的一级分类且子分类非空则遍历二级分类
                if(category.text==data.value && category.children){
                    //修改全局变量categoryID
                    categoryId=category.id;
                    $.each(category.children,function(index,type){
                        appendOption($form.find('select[name=type]'),type.text,type.text);
                    });
                }
            });
            //否则置空categoryId
        }else{
            categoryId=null;
        }
        //渲染表格
        form.render();
    }

    //监听二级分类选择事件
    function typeEvent(data){
        //当选择的不是提示选项时则遍历一级分类
        if(data.value!=""){
            $.each(typeData,function(index,category){
                //如果是当前选择的一级分类则遍历二级分类
                if(category.id==categoryId) {
                    $.each(category.children,function(index,type){
                        //如果是当前选择的二级分类则修改全局变量typeId
                        if(type.text==data.value){
                            typeId=type.id;
                        }
                    });
                }
            });
            //否则置空typeId
        }else{
            typeId=null;
        }
    }

});