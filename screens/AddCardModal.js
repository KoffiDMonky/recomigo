import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, Animated } from "react-native";
import Modal from "react-native-modal";
import MultiStepForm from "./MultiStepForm";
import DragHandle from "./../components/DragHandle";

export default function AddCardModal({ isVisible, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const handleFinish = (finalData) => {
    onSave(finalData);
    onClose();
  };

  useEffect(() => {
    if (isVisible) {
      setFormData({});
    }
  }, [isVisible]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      avoidKeyboard={true}
      propagateSwipe={false}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
    >
      <View style={styles.modalContent}>
        <DragHandle onClose={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // ajuste selon ton header
        >
          {/* 🧩 Affichage du formulaire multi-étapes */}
          <MultiStepForm
            onFinish={handleFinish}
            onCancel={onClose}
          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    height: "95%",
  },
});
