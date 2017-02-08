function convertToYaml(data) {

	for (var i=0; i<nodeArr.length; i++){
		if (document.getElementById(nodeArr[i][1]).getAttribute('taska_id')==null || document.getElementById(nodeArr[i][1]).getAttribute('taska_id')==''){
			return false;
		}
	}

	data = decodeJSON(data,null);
	data = JSON.parse(data);

	var elementList = data.diagram.elements; //stores all elements
    var allNodes = data.diagram.elements.nodes;
    var allArrows = data.diagram.elements.arrows;
    var allNotes = data.diagram.elements.notes;
    var loadedRows = data.diagram.rows;
    var loadedCols = data.diagram.cols;
    var separators = data.diagram.elements.separators
    var description = data.diagram.description
    startArrowAtIndex = 0;
    var yamlText = '';
    yamlText += 'callFlowName: "'+description+'"\n';
    yamlText += 'callSequenceSteps:\n';
    for (var s = 0; s<separators.length; s++){
    yamlText += '  - \n';
    yamlText += '    name: "'+separators[s].text+'"\n';
    yamlText += '    subSteps:\n';
    for (var i=startArrowAtIndex; i<allArrows.length; i++){
    var index = recallArray(arrowArr,allArrows[i].id)
    	try{
    	if (parseInt(arrowArr[index][4])>=parseInt(separators[s+1].lineNumber)*42+60){
        	startArrowAtIndex = index;
        	break;
        }
    }
    catch (err){}
    yamlText += '      - \n';
    yamlText += '        destination_tosca_id: '+document.getElementById(arrowArr[index][9]).getAttribute('taska_id')+'\n';
    yamlText += '        link_description: "'+arrowArr[index][10]+'"\n';
    yamlText += '        link_message: "'+arrowArr[index][2]+'"\n';
    var linkTitleName='';
    if (arrowArr[index][10]!=='') {
    	linkTitleName= arrowArr[index][2];
    }    	
    yamlText += '        link_title: "'+linkTitleName+'"\n';
		var linkType  = 'standard';
		if (arrowArr[index][0].attributes.direction.value==='self') {
			linkType  = 'self'
		}
    yamlText += '        link_type: '+linkType+'\n';
    
    // if message_type attribute does not exist, set it as signal by default
    var message_type_val = 'media'
    if (arrowArr[index][0].hasAttribute('message_type')) {
    	message_type_val = arrowArr[index][0].attributes.message_type.value;
    }
    yamlText += '        message_type: '+ message_type_val +'\n';
    yamlText += '        source_tosca_id: '+document.getElementById(arrowArr[index][8]).getAttribute('taska_id')+'\n';
    }
    }
    yamlText += 'networkElementSequenceToscaIDs:\n';
    for (var i=0; i<nodeArr.length;i++){
		yamlText += '  - \n'
    yamlText += '    tosca_id: '+document.getElementById(nodeArr[i][1]).getAttribute('taska_id')+'\n';
    var NodeRoleID =''
    if (nodeArr[i][0].hasAttribute('role_id')) {
    	NodeRoleID = nodeArr[i][0].attributes.role_id.value
    }
	yamlText += '    role: "'+ NodeRoleID +'"\n';
    }
    yamlText += 'overviewDescription: description';
    return yamlText;
}
