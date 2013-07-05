var componentsModels =
{
    position2d : "return {x : datas.x || 0, y : datas.y || 0};",

    size2d : "return {width : datas.width || 0, height : datas.height || 0, radius : datas.radius || 0};",

    renderShape : "return {color : datas.color || 0, shape : datas.shape || 0};",

    renderTexture : "return {image : datas.image || null, layer : datas.layer || 0};",

    velocity2d : "return {x : datas.x || 0, y : datas.y || 0};"
}